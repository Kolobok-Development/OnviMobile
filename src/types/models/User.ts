import {ICard} from './Card';

export interface IUser {
  id: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  cards: ICard | null;
  avatar: string | null;
  balance: number | null;
  tariff: number | null;
}

export interface IUserPartial {
  id?: number | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  birthday?: string | null;
  cards?: ICard | null;
  avatar?: string | null;
  balance?: number | null;
  tariff?: number | null;
}
