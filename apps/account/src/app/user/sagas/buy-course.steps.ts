import { CourseGetCourse, PaymentGenerateLink } from "@account/contracts";
import { PurchaseState } from "@account/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state"

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const { course } = await this.saga.rqmService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, { id: this.saga.courseId });
    if (!course) {
      throw new Error('Such course does not exist');
    }
    if (course.price === 0) {
      this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
      return { paymentLink: null, user: this.saga.user };
    }
    const { paymentLink } = await this.saga.rqmService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price
    });
    this.saga.setState(PurchaseState.WaitingForPayment, course._id);
    return { paymentLink, user: this.saga.user };
  }

  public chackPayment(): Promise<{ user: UserEntity; }> {
    throw new Error("Can't check status of a payment which has yet not started");
  }

  public async cansel(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
    return { user: this.saga.user }
  }
}
