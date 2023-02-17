import { PurchaseState } from '@account/interfaces';
import { IsString } from 'class-validator';
import { PaymentStatus } from '../payment/payment.check';

export namespace AccountChangeCourse {
  export const topic = 'account.change-course.event'
  
  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;

    @IsString()
    state: PurchaseState;
  }
}
