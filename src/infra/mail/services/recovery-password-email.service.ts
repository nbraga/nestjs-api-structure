import { MailTransporter } from "@/common/mail/mail.transporter";
import { renderTemplate } from "@/utils/email.util";

import { Injectable } from "@nestjs/common";

interface RecoveryPasswordEmailServiceProps {
    to: string;
    link: string;
    name: string;
}

@Injectable()
export class RecoveryPasswordEmailService {
    constructor(private readonly mailTransporter: MailTransporter) {}

    async send({ link, name, to }: RecoveryPasswordEmailServiceProps) {
        const html = renderTemplate("recovery-password", {
            link,
            name,
        });

        return await this.mailTransporter.sendMail({
            to,
            subject: "Redefinição de senha",
            body: html,
        });
    }
}
