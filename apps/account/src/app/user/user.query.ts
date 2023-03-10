import { AccountUserCourses, AccountUserInfo } from '@account/contracts';
import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserQueries {
  constructor (
    private readonly userRepository: UserRepository
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo({ id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return {
      profile
    }
  }

  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses({ id }: AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
    const user =  await this.userRepository.findUserById(id);
    return {
      courses: user.courses
    }
  }
}
