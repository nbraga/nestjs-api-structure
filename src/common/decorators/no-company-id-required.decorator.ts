import { SetMetadata } from "@nestjs/common";

export const NO_COMPANY_ID_REQUIRED_KEY = "noCompanyIdRequired";
export const NoCompanyIdRequired = () =>
    SetMetadata(NO_COMPANY_ID_REQUIRED_KEY, true);
