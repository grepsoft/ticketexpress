import {
    Seat,
  } from "./styles";

export const OneSeat = ({
    id,
    coords,
    price,
    setInfoCard,
    setSeatNumber,
    setPrice,
    onSeatClick,
    activeSeat,
    holdSeats,
    bookedSeats,
    dragActive,
  }) => {
    const handleSeatClick = (event) => {
      onSeatClick({ seat: event.target.id, price: price });
    };
  
    const handleMouseEnter = (event) => {
      const { x, y } = event.target.getBoundingClientRect();
  
      if (!dragActive) {
        setInfoCard({
          x: x,
          y: y,
        });
  
        if( bookedSeats.indexOf(event.target.id) >= 0 ) {
          setSeatNumber("Booked");  
          setPrice(null);
        } else {
          setSeatNumber(id);  
          setPrice(price);
        }

      }
    };
  
    const handleMouseLeave = (event) => {
      setInfoCard({
        x: 0,
        y: 0,
      });
  
      setSeatNumber(null);
    };
    return (
      <>
        <Seat      
          onMouseUp={handleSeatClick}
          onMouseOver={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          id={id}
          x={coords.x}
          y={coords.y}
          width="80"
          height="50"
          rx="10"
          ry="10"
          booked={bookedSeats.findIndex((s) => s === id)}
          hold={holdSeats.findIndex((s) => s === id)}
        />
      </>
    );
  };