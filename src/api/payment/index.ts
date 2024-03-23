import {ICreatePaymentRequest} from '../../types/api/payment/req/ICreatePaymentRequest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from 'axios/index';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {IUserApiErrorResponse} from '../../types/api/common/IUserApiErrorResponse';
import {userApiInstance} from '../axiosConfig';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';

enum PAYMENT {
  CREATE_PAYMENT_URL = '/payment',
}
export async function create(body: ICreatePaymentRequest): Promise<any> {
  try {
    const response = await userApiInstance.post<IUserApiResponse<any>>(
      PAYMENT.CREATE_PAYMENT_URL,
      body)

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
