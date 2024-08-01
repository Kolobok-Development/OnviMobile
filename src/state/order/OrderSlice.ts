import {StoreSlice} from '../store.ts';

export interface OrderSlice {
  name: string;
  setName: (name: string) => void;
  sum: number;
  setSum: (sum: number) => void;
  orderDetails: {
    PoSId: number;
    bayNumber?: number;
    promoCodeId?: string;
    rewardPointsUsed?: number;
  };
  setOrderDetails: (orderDetails: any) => void;
}

const createOrderSlice: StoreSlice<OrderSlice> = set => ({
  name: '',
  setName: (name: string) => set(state => ({...state, name})),

  sum: 0,
  setSum: (sum: number) => set(state => ({...state, sum})),

  orderDetails: {
    PoSId: 0,
    bayNumber: undefined,
    promoCodeId: undefined,
    rewardPointsUsed: undefined,
  },
  setOrderDetails: (orderDetails: {
    PoSId: number;
    bayNumber?: number;
    promoCodeId?: string;
    rewardPointsUsed?: number;
  }) => set(state => ({...state, orderDetails})),
});

export default createOrderSlice;
