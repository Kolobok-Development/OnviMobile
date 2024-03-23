export enum SendStatus {
  SUCCESS = 'Success',
  FAIL = 'Fail',
}

export interface ICreateOrderResponse {
  sendStatus: SendStatus;
  errorMessage: string | null;
}
