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
import {IUserApiErrorResponse} from '../../types/api/common/IUserApiErrorResponse';

enum AUTH {
  SEND_OTP_URL = '/auth/send/otp',
  LOGIN_URL = 'auth/login',
  REGISTER_URL = '/auth/register',
  REFRESH_URL = '/auth/refresh',
}

export async function sendOtp(
  body: ISendOtpRequest,
): Promise<ISendOtpResponse | IUserApiErrorResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ISendOtpResponse>
    >(AUTH.SEND_OTP_URL, body);

    return response.data.data;
  } catch (error: unknown) {
    console.log(error)
    return error as IUserApiErrorResponse
  }
}

export async function login(body: ILoginRequest): Promise<ILoginResponse | IUserApiErrorResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ILoginResponse>
    >(AUTH.LOGIN_URL, body);

    return response.data.data;
  } catch (error: unknown) {
    console.log(error);
    return error as IUserApiErrorResponse
  }
}
export async function register(
  body: IRegisterRequest,
): Promise<IRegisterResponse | IUserApiErrorResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<IRegisterResponse>
    >(AUTH.REGISTER_URL, body);

    return response.data.data;
  } catch (error: unknown) {
    console.log(error);
    return error as IUserApiErrorResponse
  }
}
export async function refresh(
  body: IRefreshRequest,
): Promise<IRefreshResponse | IUserApiErrorResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<IRefreshResponse>
    >(AUTH.REFRESH_URL, body);

    return response.data.data;
  } catch (error: unknown) {
    console.log(error);
    return error as IUserApiErrorResponse
  }
}
