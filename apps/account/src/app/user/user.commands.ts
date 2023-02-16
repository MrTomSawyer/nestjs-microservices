import { AccountChangeProfile, AccountUserInfo } from '@account/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserCommands {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async userInfo(@Body() { user, id }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new Error('No such user exist')
    }
    const userEntity = new UserEntity(existingUser).updateProfile(user.displayName);
    await this.userRepository.updateUser(userEntity);
    return {};
  }
}
