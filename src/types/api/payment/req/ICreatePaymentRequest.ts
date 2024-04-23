export interface ICreatePaymentRequest {
  paymentToken: string;
  amount: string;
  currency?: string;
  capture?: boolean;
  description?: string;
}
