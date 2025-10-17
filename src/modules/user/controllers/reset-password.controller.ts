import { IsPublic } from "@/common/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    type ResetPasswordDto,
    resetPasswordSchema,
} from "@/modules/user/dto/reset-password.dto";
import { ResetPasswordService } from "@/modules/user/services/reset-password.service";
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    InternalServerErrorException,
    Post,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("user/reset-password")
@IsPublic()
@ApiTags("Usuários")
export class ResetPasswordController {
    constructor(private readonly resetPasswordService: ResetPasswordService) {}

    @Post()
    @HttpCode(200)
    @ApiOperation({
        summary: "Resetar senha do usuário",
        description:
            "Endpoint para resetar a senha do usuário usando um token de recuperação",
    })
    @ApiBody({
        description: "Dados para resetar a senha",
        schema: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    description: "Token de recuperação de senha",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                password: {
                    type: "string",
                    description: "Nova senha (mínimo 6 caracteres)",
                    example: "novaSenha123",
                    minLength: 6,
                },
            },
            required: ["token", "password"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Senha resetada com sucesso",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Senha resetada com sucesso",
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: "Token inválido ou usuário não encontrado",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Token inválido",
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Erro interno do servidor",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Erro interno do servidor",
                },
            },
        },
    })
    async resetPassword(
        @Body(new ZodValidationPipe(resetPasswordSchema))
        body: ResetPasswordDto,
    ) {
        const result = await this.resetPasswordService.execute({
            token: body.token,
            password: body.password,
        });

        if (result.status === "success") {
            return {
                message: "Senha resetada com sucesso",
            };
        }

        switch (result.error) {
            case "Token inválido":
                throw new BadRequestException({
                    message: result.error,
                });
            case "Usuário não encontrado":
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
