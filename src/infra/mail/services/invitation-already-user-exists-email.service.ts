import { MailTransporter } from "@/common/mail/mail.transporter";
import { renderTemplate } from "@/utils/email.util";
import { Injectable } from "@nestjs/common";

interface InvitationUserEmailServiceProps {
    to: string;
    inviteLink: string;
    companyName: string;
    inviterName: string;
    inviteeEmail: string;
}

@Injectable()
export class InvitationAlreadyUserExistsEmailService {
    constructor(private readonly mailTransporter: MailTransporter) {}

    async send({
        companyName,
        inviteLink,
        inviteeEmail,
        inviterName,
        to,
    }: InvitationUserEmailServiceProps) {
        const html = renderTemplate("invitation-already-user-exists", {
            inviteLink,
            companyName,
            inviterName,
            inviteeEmail,
        });

        return this.mailTransporter.sendMail({
            to,
            subject: "Convite para o Clics",
            body: html,
        });
    }
}
