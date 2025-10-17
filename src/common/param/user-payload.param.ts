import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserPayloadParam = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const context = ctx.switchToHttp();
        const request: Request = context.getRequest();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return request["user"];
    },
);
