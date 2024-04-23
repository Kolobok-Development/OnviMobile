import {ICreatePaymentRequest} from '../../types/api/payment/req/ICreatePaymentRequest';
import {userApiInstance} from '../axiosConfig';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';

enum PAYMENT {
  CREATE_PAYMENT_URL = '/payment',
}
export async function create(body: ICreatePaymentRequest): Promise<any> {
  const response = await userApiInstance.post<IUserApiResponse<any>>(
    PAYMENT.CREATE_PAYMENT_URL,
    body,
  );

  return response.data.data;
}
