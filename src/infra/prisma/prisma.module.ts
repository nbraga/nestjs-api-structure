import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [PrismaService, UserRepository],
})
export class PrismaModule {}
