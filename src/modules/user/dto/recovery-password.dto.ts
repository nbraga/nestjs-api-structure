import { z } from "zod";

export const recoveryPasswordSchema = z.object({
    email: z.email(),
});

export type RecoveryPasswordDto = z.infer<typeof recoveryPasswordSchema>;
