import { useRef, useState } from "react";
import { SECONDS } from "../constants";

export const useTick = () => {
  const [second, setSecond] = useState(SECONDS);

  const ref = useRef();

  const startTick = () =>
    (ref.current = setInterval(() => {
      setSecond((s) => (s > 0 ? s - 1 : SECONDS));
    }, 1000));

  const resetTick = () => setSecond(SECONDS);
  const clearTick = () => clearInterval(ref.current);

  return [second, startTick, resetTick, clearTick];
};
