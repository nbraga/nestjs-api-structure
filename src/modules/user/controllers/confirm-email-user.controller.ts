import { NoCompanyIdRequired } from "@/common/decorators/no-company-id-required.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import type { UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserPayloadParam } from "@/common/param/user-payload.param";
import { ConfirmEmailUserService } from "@/modules/user/services/confirm-email-user.service";
import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Usuários")
@Controller("user/confirm-email")
@UseGuards(AuthGuard)
@NoCompanyIdRequired()
export class ConfirmEmailUserController {
    constructor(
        private readonly confirmEmailUserService: ConfirmEmailUserService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({
        summary: "Confirmar email do usuário",
        description:
            "Confirma o endereço de email do usuário autenticado, ativando sua conta",
    })
    @ApiOkResponse({
        description: "Email do usuário confirmado com sucesso",
        schema: {
            example: {
                message: "Email do usuário confirmado com sucesso",
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Usuário não encontrado",
        schema: {
            example: {
                message: "Usuário não encontrado",
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
    async create(@UserPayloadParam() user: UserPayloadProps) {
        const result = await this.confirmEmailUserService.execute(user.id);

        if (result.status === "success") {
            return {
                message: "Email do usuário confirmado com sucesso",
            };
        }

        switch (result.error) {
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
