import {StoreSlice} from '../store.ts';
import {CarWash, CarWashLocation} from '../../api/AppContent/types.ts';

export interface PosSlice {
  posList: CarWashLocation[];
  setPosList: (values: CarWashLocation[]) => void;
  selectedPos: CarWash;
  setSelectedPos: (value: CarWash) => void;
  nearByPos: CarWash;
  setNearByPos: (value: CarWash) => void;
}

const createPoSSlice: StoreSlice<PosSlice> = set => ({
  posList: [],
  setPosList: (values: any[]) => set(state => ({...state, posList: values})),

  selectedPos: {},
  setSelectedPos: (value: any) =>
    set(state => ({...state, selectedPos: value})),

  nearByPos: {},
  setNearByPos: (value: any) => set(state => ({...state, nearByPos: value})),
});

export default createPoSSlice;
