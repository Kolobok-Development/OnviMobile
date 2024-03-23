import { PaymentMethodTypesEnum } from "./PaymentType";

export interface ConfirmationPaymentParams {
  confirmationUrl: string;
  paymentMethodType: PaymentMethodTypesEnum;
}
