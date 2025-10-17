import { NoCompanyIdRequired } from "@/common/decorators/no-company-id-required.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { type UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { UserPayloadParam } from "@/common/param/user-payload.param";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
    type UpdateUserDto,
    updateUserSchema,
} from "@/modules/user/dto/update-user.dto";
import { UpdateUserService } from "@/modules/user/services/update-user.service";
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Put,
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

@ApiTags("Usuários")
@Controller("user")
@UseGuards(AuthGuard)
@NoCompanyIdRequired()
export class UpdateUserController {
    constructor(private readonly updateUserService: UpdateUserService) {}

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("JWT-auth")
    @ApiOperation({
        summary: "Atualizar informações do usuário",
        description:
            "Permite que o usuário autenticado atualize suas informações pessoais",
    })
    @ApiBody({
        description: "Dados para atualização do usuário",
        schema: {
            type: "object",
            properties: {
                fullName: {
                    type: "string",
                    description: "Nome completo do usuário",
                    example: "João da Silva",
                },
                phone: {
                    type: "string",
                    description: "Telefone do usuário",
                    example: "(11) 98765-4321",
                },
                sector: {
                    type: "string",
                    description: "Setor do usuário na empresa",
                    example: "Tecnologia",
                },
            },
        },
    })
    @ApiOkResponse({
        description: "Usuário atualizado com sucesso",
        schema: {
            example: {
                message: "Usuário atualizado com sucesso",
            },
        },
    })
    @ApiBadRequestResponse({
        description: "Usuário não encontrado ou sem permissão",
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
    async updateUser(
        @UserPayloadParam() user: UserPayloadProps,
        @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserDto,
    ) {
        const result = await this.updateUserService.execute({
            userId: user.id,
            body,
        });

        if (result.status === "success") {
            return {
                message: "Usuário atualizado com sucesso",
            };
        }

        switch (result.error) {
            case "Usuário não encontrado":
                throw new BadRequestException({
                    message: result.error,
                });
            case "Você não pode atualizar o usuário de outra empresa":
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
