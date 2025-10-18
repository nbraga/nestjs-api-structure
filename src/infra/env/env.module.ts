import { EnvService } from "@/infra/env/env.service";
import { Global, Module } from "@nestjs/common";
@Global()
@Module({
    providers: [EnvService],
    exports: [EnvService],
})
export class EnvModule {}
