import {ICard} from './Card';

export interface IUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string | null;
  cards: ICard;
}
