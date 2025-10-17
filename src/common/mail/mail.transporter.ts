import { EnvService } from "@/infra/env/env.service";
import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";

interface SendMailProps {
    to: string;
    subject: string;
    body: string;
}

@Injectable()
export class MailTransporter {
    constructor(private readonly envService: EnvService) {}

    async sendMail({ body, subject, to }: SendMailProps): Promise<void> {
        const mailHost = this.envService.get("MAIL_HOST");
        const mailPort = this.envService.get("MAIL_PORT");
        const mailUser = this.envService.get("MAIL_USER");
        const mailPass = this.envService.get("MAIL_PASS");

        const transport = createTransport({
            host: mailHost,
            port: mailPort,
            auth: {
                user: mailUser,
                pass: mailPass,
            },
        });

        await transport.sendMail({
            to,
            subject,
            html: body,
        });
    }
}
