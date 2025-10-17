import { z } from "zod";

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
