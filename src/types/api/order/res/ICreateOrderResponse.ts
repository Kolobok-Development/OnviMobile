export enum SendStatus {
  CREATED = 'CREATED',
  FAIL = 'Fail',
}

export interface ICreateOrderResponse {
  sendStatus: SendStatus;
  orderId: number;
}
