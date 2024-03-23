import { PaymentMethodTypesEnum } from "./PaymentType";
import { GooglePaymentMethodTypesEnum } from "./GooglePaymentMethodTypes";

export interface PaymentConfig {
  clientApplicationKey: string;
  shopId: string;
  title: string;
  subtitle: string;
  price: number;
  paymentMethodTypes?: PaymentMethodTypesEnum[];
  customerId?: number;
  authCenterClientId?: string; // ! If YooMoney method selected
  userPhoneNumber?: string;
  gatewayId?: string;
  returnUrl?: string;
  googlePaymentMethodTypes?: GooglePaymentMethodTypesEnum[];
  applePayMerchantId?: string;
  isDebug?: boolean;
}
