import {userApiInstance} from '../axiosConfig';
import {ISendOtpRequest} from '../../types/api/auth/req/ISendOtpRequest';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';
import {ISendOtpResponse} from '../../types/api/auth/res/ISendOtpResponse';
import {ILoginResponse} from '../../types/api/auth/res/ILoginResponse';
import {ILoginRequest} from '../../types/api/auth/req/ILoginRequest';
import {IRegisterRequest} from '../../types/api/auth/req/IRegisterRequest';
import {IRegisterResponse} from '../../types/api/auth/res/IRegisterResponse';
import {IRefreshResponse} from '../../types/api/auth/res/IRefreshResponse';
import {IRefreshRequest} from '../../types/api/auth/req/IRefreshRequest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {IUserApiErrorResponse} from '../../types/api/common/IUserApiErrorResponse';

enum AUTH {
  SEND_OTP_URL = '/auth/send/otp',
  LOGIN_URL = 'auth/login',
  REGISTER_URL = '/auth/register',
  REFRESH_URL = '/auth/refresh',
}

export async function sendOtp(
  body: ISendOtpRequest,
): Promise<ISendOtpResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ISendOtpResponse>
    >(AUTH.SEND_OTP_URL, body);

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}

export async function login(body: ILoginRequest): Promise<ILoginResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ILoginResponse>
    >(AUTH.LOGIN_URL, body);

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
export async function register(
  body: IRegisterRequest,
): Promise<IRegisterResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ILoginResponse>
    >(AUTH.REGISTER_URL, body);

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
export async function refresh(
  body: IRefreshRequest,
): Promise<IRefreshResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ILoginResponse>
    >(AUTH.REFRESH_URL, body);

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
