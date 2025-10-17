import { MailTransporter } from "@/common/mail/mail.transporter";
import { renderTemplate } from "@/utils/email.util";
import { Injectable } from "@nestjs/common";

interface InvitationConfirmEmailUserServiceProps {
    to: string;
    link: string;
    name: string;
}

@Injectable()
export class InvitationConfirmEmailUserService {
    constructor(private readonly mailTransporter: MailTransporter) {}

    async send({ link, name, to }: InvitationConfirmEmailUserServiceProps) {
        const html = renderTemplate("confirm-mail", {
            link,
            name,
        });

        return this.mailTransporter.sendMail({
            to,
            subject: "Confirmação de email",
            body: html,
        });
    }
}
