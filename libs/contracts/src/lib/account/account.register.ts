import { IsEmail, IsString } from 'class-validator';
import { IsOptional } from 'class-validator/types/decorator/decorators';

export namespace AccountRegister {
  export const topic = 'account.register.command'
  
  export class Request {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    displayName?: string;
  }
  
  export class Response {
    email: string;
  }
}
