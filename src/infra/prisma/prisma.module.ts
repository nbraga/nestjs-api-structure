import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    providers: [PrismaService, PrismaUserRepository],
    exports: [PrismaService, PrismaUserRepository],
})
export class PrismaModule {}
