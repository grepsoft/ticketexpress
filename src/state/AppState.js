import { createContext, useContext, useReducer } from "react";
import { MINUTES } from "../constants";

const AppStateContext = createContext({});
const initialState = {
  m: MINUTES,
  buy: false,
  paymentSucess: false,
  clearTick: false,
  processing: false
};
export const useAppState = () => useContext(AppStateContext);

function reducer(state, action) {
  switch (action.type) {
    case "seconds":
      return { ...state, m: state.m - 1 };
    case "buy":
      return { ...state, buy: true };
    case "paymentsuccess":
      return { ...state, paymentSucess: true };
    case "processingstart":
      return { ...state, processing: true };
    case "processingend":
      return { ...state, processing: false };
    case "reset": 
      return { ...state, m: MINUTES, buy: false, paymentSucess: false, processing: false }
    default:
      throw new Error();
  }
}

function AppState({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export default AppState;
