import { NoCompanyIdRequired } from "@/common/decorators/no-company-id-required.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { type UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserPayloadParam } from "@/common/param/user-payload.param";
import {
    BadRequestException,
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
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { ResendConfirmEmailUserService } from "../services/resend-confirm-email-user.service";

@ApiTags("Usuários")
@Controller("user/resend-confirm-email")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ResendConfirmEmailUserController {
    constructor(
        private readonly resendConfirmEmailUserService: ResendConfirmEmailUserService,
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @NoCompanyIdRequired()
    @ApiOperation({
        summary: "Reenviar email de confirmação",
        description:
            "Reenvia o email de confirmação para o usuário autenticado.",
    })
    @ApiOkResponse({
        description: "Email de confirmação reenviado com sucesso",
        schema: {
            example: {
                message: "Email de confirmação reenviado com sucesso",
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
        const result = await this.resendConfirmEmailUserService.execute(
            user.id,
        );

        if (result.status === "success") {
            return {
                message: "Email de confirmação reenviado com sucesso",
            };
        }

        switch (result.error) {
            case "Usuário não encontrado":
                throw new BadRequestException({
                    message: result.error,
                });
            case "Usuário já está ativo":
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
