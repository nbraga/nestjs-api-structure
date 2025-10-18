import { CryptographyModule } from "@/common/cryptography/cryptography.module";
import { MailModule } from "@/infra/mail/mail.module";
import { PrismaModule } from "@/infra/prisma/prisma.module";
import { ChangePasswordController } from "@/modules/user/controllers/change-password.controller";
import { ConfirmEmailUserController } from "@/modules/user/controllers/confirm-email-user.controller";
import { CreateUserController } from "@/modules/user/controllers/create-user.controller";
import { FindMeController } from "@/modules/user/controllers/find-me.controller";
import { RecoveryPasswordController } from "@/modules/user/controllers/recovery-password.controller";
import { ResendConfirmEmailUserController } from "@/modules/user/controllers/resend-confirm-email-user.controller";
import { ResetPasswordController } from "@/modules/user/controllers/reset-password.controller";
import { UpdateUserController } from "@/modules/user/controllers/update-user.controller";
import { ChangePasswordService } from "@/modules/user/services/change-password.service";
import { ConfirmEmailUserService } from "@/modules/user/services/confirm-email-user.service";
import { CreateUserService } from "@/modules/user/services/create-user.service";
import { FindMeService } from "@/modules/user/services/find-me.service";
import { RecoveryPasswordService } from "@/modules/user/services/recovery-password.service";
import { ResendConfirmEmailUserService } from "@/modules/user/services/resend-confirm-email-user.service";
import { ResetPasswordService } from "@/modules/user/services/reset-password.service";
import { UpdateUserService } from "@/modules/user/services/update-user.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule, CryptographyModule, MailModule],
    controllers: [
        CreateUserController,
        FindMeController,
        RecoveryPasswordController,
        ResetPasswordController,
        ChangePasswordController,
        ResendConfirmEmailUserController,
        ConfirmEmailUserController,
        UpdateUserController,
    ],
    providers: [
        CreateUserService,
        FindMeService,
        RecoveryPasswordService,
        ResetPasswordService,
        ConfirmEmailUserService,
        ChangePasswordService,
        ResendConfirmEmailUserService,
        UpdateUserService,
    ],
    exports: [
        CreateUserService,
        FindMeService,
        RecoveryPasswordService,
        ResetPasswordService,
        ConfirmEmailUserService,
        ChangePasswordService,
        ResendConfirmEmailUserService,
        UpdateUserService,
    ],
})
export class UserModule {}
