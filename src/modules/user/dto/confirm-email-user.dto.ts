import { z } from "zod";

export const confirmEmailUserSchema = z.object({
    userId: z.uuid(),
});

export type ConfirmEmailUserDto = z.infer<typeof confirmEmailUserSchema>;
