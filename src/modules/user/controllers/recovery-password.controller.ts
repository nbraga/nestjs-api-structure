import { IsPublic } from "@/common/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
} from "@nestjs/common";
import {
    ApiBody,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import {
    type RecoveryPasswordDto,
    recoveryPasswordSchema,
} from "../dto/recovery-password.dto";
import { RecoveryPasswordService } from "../services/recovery-password.service";

@Controller("user/recovery-password")
@IsPublic()
@ApiTags("Usuários")
@IsPublic()
export class RecoveryPasswordController {
    constructor(
        private readonly recoveryPasswordService: RecoveryPasswordService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Solicitar recuperação de senha",
        description:
            "Endpoint para solicitar o envio de um email de recuperação de senha",
    })
    @ApiBody({
        description: "Dados para solicitar recuperação de senha",
        schema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    format: "email",
                    description: "Email do usuário para recuperação de senha",
                    example: "usuario@exemplo.com",
                },
            },
            required: ["email"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Email de recuperação enviado com sucesso",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Email de recuperação de senha enviado",
                },
                data: {
                    type: "object",
                    description: "Dados adicionais da operação",
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Usuário não encontrado ou erro ao enviar email",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Usuário não encontrado",
                },
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro interno do servidor",
                error: "INTERNAL_SERVER_ERROR",
            },
        },
    })
    async recoveryPassword(
        @Body(new ZodValidationPipe(recoveryPasswordSchema))
        body: RecoveryPasswordDto,
    ) {
        const result = await this.recoveryPasswordService.execute(body);

        if (result.status === "success") {
            return {
                message: "Email de recuperação de senha enviado",
                data: result.data,
            };
        }

        switch (result.error) {
            case "Usuário não encontrado":
                throw new BadRequestException({
                    message: result.error,
                });
            case "Erro ao enviar email":
                throw new BadRequestException({
                    message: result.error,
                });
            default:
                throw new InternalServerErrorException({
                    message: "Erro interno do servidor",
                });
        }
    }
}
