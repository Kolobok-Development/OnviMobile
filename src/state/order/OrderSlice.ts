import { StoreSlice } from '../store.ts';
import { Price } from "../../api/AppContent/types.ts"

import { CarWashLocation } from '../../api/AppContent/types.ts';

export type OrderDetailsType = {
  posId?: null | number;
  sum?: null | number;
  bayNumber?: number | null;
  promoCodeId?: number | null;
  rewardPointsUsed?: null | number;
  type?: null | string
  name?: null | string
  prices?: Price[]
  order?: number | null
  orderDate?: string | null
}

export interface OrderSlice {
  name: string;
  setName: (name: string) => void;
  sum: number;
  setSum: (sum: number) => void;
  orderDetails: OrderDetailsType
  setOrderDetails: (orderDetails: OrderDetailsType) => void;

  business: CarWashLocation & { close: boolean } | null
  setBusiness: (valud: CarWashLocation & { close: boolean }  | null) => void
}

const createOrderSlice: StoreSlice<OrderSlice> = set => ({
  name: '',
  setName: (name: string) => set(state => ({...state, name})),

  sum: 0,
  setSum: (sum: number) => set(state => ({...state, sum})),

  orderDetails: {
    posId: 0,
    sum: 0,
    bayNumber: null,
    promoCodeId: null,
    rewardPointsUsed: null,
    type: null,
    name: null,
    prices: [],
    order:  null,
    orderDate: null
  },
  setOrderDetails: (orderDetails: OrderDetailsType) => set(state => ({...state, orderDetails})),
  business: null,
  setBusiness: (value: CarWashLocation & { close: boolean }  | null) => set(state => ({...state, business: value})),
});

export default createOrderSlice;
