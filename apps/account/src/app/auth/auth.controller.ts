import { AccountLogin, AccountRegister } from '@account/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServise: AuthService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authServise.register(dto)
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authServise.validateUser(email, password);
    return this.authServise.login(id)
  }
}
