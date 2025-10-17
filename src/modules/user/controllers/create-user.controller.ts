import { NoCompanyIdRequired } from "@/common/decorators/no-company-id-required.decorator";
import { IsPublic } from "@/common/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import { CreateUserService } from "@/modules/user/services/create-user.service";
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
} from "@nestjs/common";
import {
    ApiBody,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    ApiTags,
} from "@nestjs/swagger";
import {
    type CreateUserDto,
    createUserSchema,
    CreateUserSwaggerDto,
} from "../dto/create-user.dto";

@ApiTags("Usuários")
@Controller("user")
@IsPublic()
@NoCompanyIdRequired()
export class CreateUserController {
    constructor(private readonly createUserService: CreateUserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({
        schema: {
            type: "object",
            properties: CreateUserSwaggerDto(),
            required: ["user", "company"],
        },
        description: "Dados para criação de usuário, empresa e papéis.",
    })
    @ApiConflictResponse({
        description: "Email já está em uso",
        schema: {
            example: {
                message: "Email já está em uso",
                error: "EMAIL_ALREADY_EXISTS",
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: "Erro interno do servidor",
        schema: {
            example: {
                message: "Erro interno do servidor",
                error: "INTERNAL_SERVER_ERROR",
            },
        },
    })
    async create(
        @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
    ) {
        const result = await this.createUserService.execute(body);

        if (result.status === "success") {
            return {
                message: "Usuário criado com sucesso",
                token: result.data.token,
            };
        }

        switch (result.error) {
            case "Email já está em uso":
            case "CNPJ já está em uso":
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
