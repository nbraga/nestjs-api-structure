import {
    CallHandler,
    ExecutionContext,
    Logger,
    NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        const userAgent = req.get("user-agent") || "Unknown";
        const ip = req.ip || req.connection.remoteAddress || "Unknown";

        const now = Date.now();
        const timestamp = new Date().toISOString();

        this.logger.log(
            `[${timestamp}] ${method} ${fullUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
            "Request",
        );

        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                this.logger.log(
                    `[${new Date().toISOString()}] ${method} ${fullUrl} - ${responseTime}ms - Completed`,
                    "Response",
                );
            }),
        );
    }
}
