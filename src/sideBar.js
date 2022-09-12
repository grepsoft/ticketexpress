import { useCallback, useEffect, useState } from "react";
import { useTick } from "./hooks/useTick";
import { Payment } from "./Payment";
import { useAppState } from "./state/AppState";
import { Price, SideBarContainer, TicketRow, TimerContainer } from "./styles";
import { formatAmount, padWithZeros } from "./utils";
import {
  SECONDS_IN_A_MINUTE,
  TIME_TO_BUY,
} from "./constants";

function SideBar({ show, onClose, onExpired, seat}) {
  const [ticks, startTick, resetTick, clearTick] = useTick();
  const { state, dispatch } = useAppState();
  const [expired, setExpired] = useState(false);

  // limit b/w 0 and 1
  // N = (x - min) / (max - min)
  const normalizedTicker = useCallback(() => {
    const currentSeconds = state.m * SECONDS_IN_A_MINUTE + ticks;

    return currentSeconds / TIME_TO_BUY;
  }, [ticks]);

  // on every tick
  useEffect(() => {
    if (ticks === 0) {
      dispatch({
        type: "seconds",
      });
    }
  }, [ticks]);

  // minutes
  useEffect(() => {
    if (state.m < 0) {
      clearTick();
      setExpired(true);
      onExpired();
    }
  }, [state.m]);

  useEffect(() => {

    if( state.paymentSucess ) {      
      onClose();    
    }

  },[state.paymentSucess]);

  // init
  useEffect(() => {
    clearTick();
    resetTick();
    setExpired(false);
    dispatch({
      type: "reset",
    });
    startTick();
  }, [seat, show]);

  return (
    <SideBarContainer show={show}>
      <TimerContainer ticker={normalizedTicker()}>
        {expired ? (
          <h1>Expired</h1>
        ) : (
          <>
            <p>HURRY UP!</p>
            <span>
              {padWithZeros(state.m)}:{padWithZeros(ticks)}
            </span>
          </>
        )}
      </TimerContainer>
      <TicketRow>
        <div>
          <p>Lorum Ipsum</p>
          <span>{seat.seat}</span>
        </div>
        <div>
          <Price>${formatAmount(seat.price)}/ea</Price>
          {!expired && (
            <button
              onClick={() => dispatch({type: "buy"})} >
              Buy
            </button>
          )}
        </div>
      </TicketRow>
      <Payment seat={seat} expired={expired}/>
      <button onClick={onClose} className="button-close">
        Close
      </button>
      
    </SideBarContainer>
  );
}

export default SideBar;
