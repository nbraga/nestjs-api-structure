import * as bcrypt from "bcryptjs";
import { BcryptServiceProps } from "../interfaces/bcrypt-service-props";

export class BcryptService implements BcryptServiceProps {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(8);
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}
