import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction, useEffect
} from "react";

interface AppContextData {
  filters: any;
  businesses: any[];
  order: any;
  bottomSheetPosition: any;
  bottomSheetOpened: boolean;
  isMainScreen: boolean;
  userLocation: any;
}

const AppContext = createContext<{
  state: AppContextData;
  setState: Dispatch<SetStateAction<AppContextData>>;
} | null>(null);

const AppProvider = ({children}: {children: ReactNode}) => {
  const [state, setState] = useState<AppContextData>({
    filters: {},
    businesses: [],
    order: null,
    bottomSheetPosition: null,
    bottomSheetOpened: true,
    isMainScreen: true,
    userLocation: null,
  });

  return (
    <AppContext.Provider value={{state, setState}}>
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export {AppProvider, useAppState};
