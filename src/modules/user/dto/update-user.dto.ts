import { z } from "zod";

export const updateUserSchema = z.object({
    fullName: z.string().min(1, "Nome completo é obrigatório"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    sector: z.string().min(1, "Setor é obrigatório"),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
