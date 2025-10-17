import { IsPublic } from "@/common/decorators/public.decorator";
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
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe";
import { type LoginDto, LoginSchema, LoginSwaggerDto } from "../dto/login.dto";
import { LoginService } from "../services/login.service";

@Controller("auth")
@IsPublic()
@ApiTags("Auth")
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @ApiTags("Auth")
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Realizar login",
        description: "Endpoint para autenticação de usuários",
    })
    @ApiBody({
        schema: {
            type: "object",
            properties: LoginSwaggerDto(),
            required: ["email", "password"],
        },
        description: "Credenciais de login",
    })
    @ApiOkResponse({
        description: "Login realizado com sucesso",
        schema: {
            example: {
                message: "Login realizado com sucesso",
                user: {
                    id: "uuid",
                    email: "user@email.com",
                    name: "Nome do Usuário",
                    phone: "+5511999999999",
                    googleId: null,
                    isFirstAccess: true,
                    isActive: true,
                    createdAt: "2024-07-09T12:00:00.000Z",
                    updatedAt: "2024-07-09T12:00:00.000Z",
                },
                token: "jwt.token.aqui",
            },
        },
    })
    @ApiUnauthorizedResponse({ description: "Email ou senha inválidos" })
    async login(
        @Body(new ZodValidationPipe(LoginSchema))
        body: LoginDto,
    ) {
        const result = await this.loginService.execute({
            body,
        });

        if (result.status === "success") {
            return {
                message: "Login realizado com sucesso",
                user: result.data.user,
                token: result.data.token,
                statusCode: HttpStatus.OK,
            };
        }

        switch (result.error) {
            case "Email ou senha inválidos":
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
