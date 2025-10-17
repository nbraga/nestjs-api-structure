import { NoCompanyIdRequired } from "@/common/decorators/no-company-id-required.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import type { UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserPayloadParam } from "@/common/param/user-payload.param";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import type { ChangePasswordDto } from "@/modules/user/dto/change-password.dto";
import { changePasswordSchema } from "@/modules/user/dto/change-password.dto";
import { ChangePasswordService } from "@/modules/user/services/change-password.service";
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

@Controller("user/change-password")
@UseGuards(AuthGuard)
@ApiTags("Usuários")
export class ChangePasswordController {
    constructor(
        private readonly changePasswordService: ChangePasswordService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("JWT-auth")
    @NoCompanyIdRequired()
    @ApiOperation({
        summary: "Alterar senha do usuário",
        description:
            "Permite que o usuário autenticado altere sua senha fornecendo a senha atual e a nova senha",
    })
    @ApiBody({
        description: "Dados para alteração de senha",
        schema: {
            type: "object",
            properties: {
                currentPassword: {
                    type: "string",
                    description: "Senha atual do usuário",
                    example: "senhaAtual123",
                },
                newPassword: {
                    type: "string",
                    description: "Nova senha (mínimo 6 caracteres)",
                    example: "novaSenha123",
                    minLength: 6,
                },
            },
            required: ["currentPassword", "newPassword"],
        },
    })
    @ApiOkResponse({
        description: "Senha alterada com sucesso",
        schema: {
            example: {
                message: "Senha alterada com sucesso",
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Usuário não encontrado ou senha atual inválida",
        schema: {
            example: {
                message: "Senha inválida",
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro interno do servidor",
            },
        },
    })
    async changePassword(
        @UserPayloadParam() user: UserPayloadProps,
        @Body(new ZodValidationPipe(changePasswordSchema))
        body: ChangePasswordDto,
    ) {
        const result = await this.changePasswordService.execute({
            userId: user.id,
            body,
        });

        if (result.status === "success") {
            return {
                message: "Senha alterada com sucesso",
            };
        }

        switch (result.error) {
            case "Usuário não encontrado":
                throw new BadRequestException({
                    message: result.error,
                });
            case "Senha inválida":
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
