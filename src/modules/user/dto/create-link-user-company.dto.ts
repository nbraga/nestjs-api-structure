import z from "zod";

export const createLinkUserCompanySchema = z.object({
    isAccepted: z.boolean(),
});

export type CreateLinkUserCompanyDto = z.infer<
    typeof createLinkUserCompanySchema
>;

export function CreateLinkUserCompanySwaggerDto() {
    return {
        isAccepted: {
            type: "boolean",
            example: true,
            description: "Indica se o convite foi aceito",
        },
    };
}
