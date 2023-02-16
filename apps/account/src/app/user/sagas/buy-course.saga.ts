import { PurchaseState } from "@account/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSagaState } from "./buy-course.state";
import { BuyCourseSagaStateStarted } from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(public user: UserEntity, public courseId: string, public rqmService: RMQService) {}

  setState(state: PurchaseState, courseId: string) {
    switch(state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        break;
      case PurchaseState.Purchased:
        break;
      case PurchaseState.Cancelled:
        break;
    }
    this.state.setContext(this);
    this.user.updateCourseStatus(courseId, state);
  }

  public getState() {
    return this.state;
  }
}
