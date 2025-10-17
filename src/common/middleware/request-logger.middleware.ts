import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        const userAgent = req.get("user-agent") || "Unknown";
        const ip = req.ip || req.connection.remoteAddress || "Unknown";

        this.logger.log(
            `[${timestamp}] ${method} ${fullUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
            "Request",
        );

        // Log response when it finishes
        const originalSend = res.send;
        res.send = function (data) {
            const responseTimestamp = new Date().toISOString();
            const statusCode = res.statusCode;

            Logger.log(
                `[${responseTimestamp}] ${method} ${fullUrl} - Status: ${statusCode} - Completed`,
                "Response",
            );

            return originalSend.call(this, data);
        };

        // Add start time to request object
        req.startTime = Date.now();

        next();
    }
}
