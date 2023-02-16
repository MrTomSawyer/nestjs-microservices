import { IsString } from 'class-validator';

export enum PaymentStatus {
  Canceled = 'canceled',
  Success = 'success',
  InProgress = 'inProgress'
}

export namespace PaymentCheck {
  export const topic = 'payment.check.query'
  
  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }
  
  export class Response {
    status: PaymentStatus
  }
}
