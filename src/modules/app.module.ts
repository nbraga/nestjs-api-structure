import { HttpExceptionFilter } from "@/common/exceptions/http-exception.filter";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RequestLoggerMiddleware } from "@/common/middleware/request-logger.middleware";
import { envSchema } from "@/infra/env/env";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import { PrismaModule } from "@/infra/prisma/prisma.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { AppController } from "@/modules/app.controller";
import { AppService } from "@/modules/app.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/user/user.module";
import {
    Module,
    type MiddlewareConsumer,
    type NestModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        EnvModule,
        PrismaModule,
        MailModule,
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes("*");
    }
}
