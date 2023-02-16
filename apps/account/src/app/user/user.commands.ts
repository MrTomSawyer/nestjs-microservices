import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@account/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute, RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller()
export class UserCommands {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly rqmService: RMQService
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

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() { userId, courseId }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error('No such user exists');
    }
    const userEntity = new UserEntity(existingUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rqmService);
    const { user, paymentLink } = await saga.getState().pay();
    await this.userRepository.updateUser(user);

    return { paymentLink }
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(@Body() { userId, courseId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new Error('No such user exists');
    }
    const userEntity = new UserEntity(existingUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rqmService);
    const { user, status } = await saga.getState().checkPayment();
    await this.userRepository.updateUser(user);
    return { status };
  }
}
