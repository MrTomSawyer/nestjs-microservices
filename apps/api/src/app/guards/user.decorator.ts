import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator((data: unknown, cxt: ExecutionContext) => {
  return cxt.switchToHttp().getRequest()?.user;
})
