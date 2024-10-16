import {PaymentMethodTypesEnum} from './PaymentType';
import {GooglePaymentMethodTypesEnum} from './GooglePaymentMethodTypes';

export interface PaymentConfig {
  clientApplicationKey: string;
  shopId: string;
  title: string;
  subtitle: string;
  price: number;
  paymentMethodTypes?: PaymentMethodTypesEnum[];
  customerId?: string;
  authCenterClientId?: string | null; // ! If YooMoney method selected
  userPhoneNumber?: string | null;
  gatewayId?: string | null;
  returnUrl?: string | null;
  googlePaymentMethodTypes?: GooglePaymentMethodTypesEnum[] | null;
  applePayMerchantId?: string | null;
  isDebug?: boolean;
}
