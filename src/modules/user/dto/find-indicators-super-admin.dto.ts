import { ApiProperty } from "@nestjs/swagger";

export class FindIndicatorsSuperAdminResponseDto {
    @ApiProperty({
        description: "Total de usuários no sistema",
        example: 150,
    })
    totalUsers: number;

    @ApiProperty({
        description: "Total de empresas no sistema",
        example: 45,
    })
    totalCompanies: number;

    @ApiProperty({
        description: "Total de processos de compra no sistema",
        example: 87,
    })
    totalProcesses: number;

    @ApiProperty({
        description: "Total de produtos no sistema",
        example: 320,
    })
    totalProducts: number;
}
