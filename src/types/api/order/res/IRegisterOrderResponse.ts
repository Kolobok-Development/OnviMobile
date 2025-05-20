export enum REGISTER_STATUS {
  CREATED = 'WAITING_PAYMENT',
  FAIL = 'Fail',
}

export interface IRegisterOrderResponse {
  status: REGISTER_STATUS;
  paymentId: string;
  confirmation_url: string;
}
