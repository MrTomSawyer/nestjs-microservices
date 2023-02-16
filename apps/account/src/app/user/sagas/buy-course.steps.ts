import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@account/contracts";
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

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("Can't check status of a payment which has yet not started");
  }

  public async cancel(): Promise<{ user: UserEntity; }> {
    this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
    return { user: this.saga.user }
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("You can't create a payment link while the payment is already in process");
  }
  public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    const { status } = await this.saga.rqmService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId
    })
    if (status === PaymentStatus.Canceled) {
      this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
      return { user: this.saga.user, status: PaymentStatus.Canceled }
    }
    if (status !== PaymentStatus.Success) {
      return { user: this.saga.user, status }
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user, status: PaymentStatus.InProgress}
  }

  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("You can't cancel processing payment");
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    throw new Error("You can't purchase a course twice");
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("You can't check status of the already purchased course");
  }
  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Purchased course can't be canceled");
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error("Method not implemented.");
  }
  public cancel(): Promise<{ user: UserEntity; }> {
    throw new Error("Method not implemented.");
  }
}