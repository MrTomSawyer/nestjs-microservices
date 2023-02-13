import { AccountLogin, AccountRegister } from '@account/contracts';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServise: AuthService
  ) {}

  @Post('register')
  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authServise.register(dto)
  }

  @Post('login')
  async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authServise.validateUser(email, password);
    return this.authServise.login(id)
  }
}
