import { Module } from "@nestjs/common";
import { CryptographyModule } from "../../common/cryptography/cryptography.module";
import { PrismaModule } from "../../infra/prisma/prisma.module";
import { LoginController } from "./controllers/login.controller";
import { LoginService } from "./services/login.service";

@Module({
    imports: [PrismaModule, CryptographyModule],
    controllers: [LoginController],
    providers: [LoginService],
    exports: [],
})
export class AuthModule {}
