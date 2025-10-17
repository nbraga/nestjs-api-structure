import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { BcryptServiceProps } from "../interfaces/bcrypt-service-props";
import { BcryptService } from "./bcrypt.service";

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: "7d" },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: BcryptServiceProps,
            useClass: BcryptService,
        },
    ],
    exports: [BcryptServiceProps, JwtModule],
})
export class CryptographyModule {}
