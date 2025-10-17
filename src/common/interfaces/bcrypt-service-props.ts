export abstract class BcryptServiceProps {
    abstract hash(password: string): Promise<string>;
    abstract compare(password: string, passwordHash: string): Promise<boolean>;
}
