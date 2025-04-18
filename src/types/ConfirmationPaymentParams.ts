import {PaymentMethodTypesEnum} from './PaymentType';

export interface ConfirmationPaymentParams {
  confirmationUrl: string;
  paymentMethodType: string;
  shopId: string;
  clientApplicationKey: string;
}
