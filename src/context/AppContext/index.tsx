import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {MiniStore} from '@context/MiniStore';
import {FiltersType} from '../../types/models/FiltersType';

function createOptimizedContext<T>() {
  const Context = createContext<MiniStore<T> | null>(null);

  const Provider = ({
    initialState,
    children,
  }: {
    initialState: T;
    children: ReactNode;
  }) => {
    const store: any = useMemo(() => new MiniStore(initialState), []);

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const store = useContext(Context);
    if (!store) {
      throw new Error('Can not use `useStore` outside of the `Provider`');
    }
    return store;
  };

  const useStateSelector = <Result extends any>(
    selector: (state: T) => Result,
  ): Result => {
    const store = useStore();
    const [state, setState] = useState(() => selector(store.getState()));
    const selectorRef = useRef(selector);
    const stateRef = useRef(state);

    useLayoutEffect(() => {
      selectorRef.current = selector;
      stateRef.current = state;
    });

    useEffect(() => {
      if (store) {
        return store.subscribe(() => {
          const state = selectorRef.current(store.getState());

          if (stateRef.current === state) {
            return;
          }

          setState(state);
        });
      }
    }, [store]);

    return state;
  };

  const useUpdate = () => {
    const store: any = useStore();

    return store.update;
  };

  return {Provider, useStateSelector, useUpdate};
}

interface AppContextData {
  value: string;
  filters: FiltersType;
  businesses: any[];
  order: any;
  bottomSheetPosition: any;
}

const {
  Provider: AppProvider,
  useStateSelector,
  useUpdate,
} = createOptimizedContext<AppContextData>();

export {AppProvider, useStateSelector, useUpdate};
