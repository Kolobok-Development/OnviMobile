import React, { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction, useEffect } from "react";

import { FiltersType } from "../../types/models/FiltersType";

interface AppContextData {
  value: string
  filters: FiltersType
  businesses: any[]
  order: any
  bottomSheetPosition: any
  bottomSheetOpened: boolean
  isMainScreen: boolean
}

const AppContext = createContext<{
  state: AppContextData;
  setState: Dispatch<SetStateAction<AppContextData>>;
} | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppContextData>({
    value: "",
    filters: {},
    businesses: [],
    order: null,
    bottomSheetPosition: null,
    bottomSheetOpened: false,
    isMainScreen: true
  });

  useEffect(() => {
    console.log("hey:", state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppState };
