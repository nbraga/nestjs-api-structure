import { HttpExceptionFilter } from "@/common/exceptions/http-exception.filter";
import { LoggingInterceptor } from "@/common/interceptors/logger.interceptor";
import type { Env } from "@/infra/env/env";
import { EnvService } from "@/infra/env/env.service";
import { AppModule } from "@/modules/app.module";
import type { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import "tsconfig-paths/register";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const envService = app.get<ConfigService<Env, true>>(EnvService);

    const port = Number(envService.get("PORT")) || 3333;

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle("API")
        .setDescription("Documentação da API com Swagger")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            operationsSorter: "alpha",
        },
        customSiteTitle: "Documentação",
    });

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(port);
}

bootstrap().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});
