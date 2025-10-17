import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common";
import { Response } from "express";

type ValidationResponse = {
    statusCode: number;
    message: string[] | string;
    path?: string[];
    data?: any;
    error?:
        | string
        | {
              name: string;
              details: Array<{
                  code: string;
                  path: string[];
                  message: string;
              }>;
          };
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const message = exception.message;
        const exceptionResponse = exception.getResponse();

        Logger.error(
            `🚨 ERRO HTTP DETECTADO: ${status} ${message} ${request.method} ${request.url} ${new Date().toISOString()}`,
        );

        if (typeof exceptionResponse === "string") {
            response.status(status).json({
                statusCode: status,
                error: message,
                path: [],
            });
        } else {
            const responseObj = exceptionResponse as ValidationResponse;

            // Verifica se é um erro do Zod com a estrutura específica
            if (
                responseObj.error &&
                typeof responseObj.error === "object" &&
                responseObj.error.details &&
                responseObj.error.details.length > 0
            ) {
                // Extrai a mensagem do primeiro detalhe de erro
                const errorMessage = responseObj.error.details[0].message;
                const errorPath = responseObj.error.details[0].path || [];

                response.status(status).json({
                    statusCode: status,
                    message: errorMessage,
                    path: errorPath,
                });
            } else {
                // Mantém o comportamento original para outros tipos de erros
                const { message, path, data } = responseObj;
                response.status(status).json({
                    statusCode: status,
                    message: Array.isArray(message) ? message[0] : message,
                    path: path || [],
                    data,
                });
            }
        }
    }
}
