import { UserEntity } from "../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";

export abstract class BuyCourseSagaState {
  public saga: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga) {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink: string, user: UserEntity }>
  public abstract chackPayment(): Promise<{ user: UserEntity }>
  public abstract cansel(): Promise<{ user: UserEntity }>
}
