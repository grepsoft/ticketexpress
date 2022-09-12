import { useState, useEffect } from "react";

export const Seating = (props) => {
    const { seat } = { ...props };
    const seats = seat.seats;
    const [seatArrangement, setSeatArrangment] = useState([]);
  
    useEffect(() => {
      let offset = 0;
      setSeatArrangment([]);
  
      for (let i = 0; i < seats; i++) {
        const oneSeat = {
          id: `${seat.group}${i}`,
          coords: {
            x: seat.coords.x + offset,
            y: seat.coords.y,
          },
          price: seat.price || -1,
        };
  
        offset += 120;
  
        setSeatArrangment((s) => [...s, oneSeat]);
      }
    }, [seats]);
  
    return <>{seatArrangement.map((s, i) => props.render(s, i))}</>;
  }