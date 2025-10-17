import z from "zod";

export const updateUserRolesSchema = z.object({
    userId: z.string(),
    roles: z.array(z.enum(["PROVIDER", "PURCHASER", "ADMIN", "ACCOUNTANT"])),
    companyId: z.string(),
});

export type UpdateUserRolesDto = z.infer<typeof updateUserRolesSchema>;
