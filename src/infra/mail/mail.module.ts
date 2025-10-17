import { MailTransporter } from "@/common/mail/mail.transporter";
import { EnvModule } from "@/infra/env/env.module";
import { InvitationUserEmailService } from "@/infra/mail/services/invitation-user-email.service";
import { RecoveryPasswordEmailService } from "@/infra/mail/services/recovery-password-email.service";
import { Module } from "@nestjs/common";
import { InvitationConfirmEmailUserService } from "./services/invitation-confirm-email-user.service";

@Module({
    imports: [EnvModule],
    providers: [
        MailTransporter,
        InvitationUserEmailService,
        RecoveryPasswordEmailService,
        InvitationConfirmEmailUserService,
    ],
    exports: [
        MailTransporter,
        InvitationUserEmailService,
        RecoveryPasswordEmailService,
        InvitationConfirmEmailUserService,
    ],
})
export class MailModule {}
