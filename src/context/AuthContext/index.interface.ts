export interface IUserType {
    id: string;
    balance: string
}

export interface IEncryptedStorage {
    accessToken: string;
    expiredDate: string;
    refreshToken: string;
    phone: string;
    email: string;
    apiKey: string;
    balance: string;
    id: number;
    name: string;
    avatar: string;
}

export interface IAuthStore {
    accessToken?: null | string;
    phone?: null | string;
    email?: null | string;
    balance?: null | string;
    loading?: boolean;
    expiredDate?: string | null;
    name?: string | null;
    id?: number | null;
    avatar: string;
}


export interface IAuthStorePartial {
    accessToken?: null | string;
    phone?: string | null;
    email?: null | string;
    balance?: string | null;
    loading?: boolean;
    expiredDate?: string | null;
    name?: string | null;
    id?: number | null;
    avatar?: string;
}

export interface IAuthContext {
    signOut: () => void;
    sendOtp: (phone: string) => void;
    store: IAuthStore;
    getMe: () => any;
    refreshToken: (refreshToken: any) => Promise<string | null>;
    register: (code: string, phone: string, acceptTerms: boolean, setRegistration: boolean) => any
    login: (otp: string, phone: string) => any
    refreshTokenFromSecureStorage: () => any
    updateAvatar: (avatar: "male" | "female" | "both") => Promise<void>
}
