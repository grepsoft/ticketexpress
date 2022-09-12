import "./App.css";
import { useState, useEffect, useRef } from "react";
import {
  Header,
  InfoCard,
  SeatingContainer,
  MapContainer,
  InfoCardContent,
} from "./styles";
import ZoomControls from "./zoomControls";
import SideBar from "./sideBar";
import { HttpService } from "./service/httpService";
import { io } from "socket.io-client";
import { OneSeat } from "./OneSeat";
import { Seating } from "./Seating";
import AppState from "./state/AppState";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SCALE_INCREMENT = 0.25;

const socket = io("http://localhost:30000");

function App() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  let boundaryX1 = 0;
  let boundaryX2 = 1280;
  let boundaryY1 = 0;
  let boundaryY2 = 720;
  const ref = useRef(null);
  const [infoCard, setInfoCard] = useState({
    x: 0,
    y: 0,
  });
  const [seatNumber, setSeatNumber] = useState();
  const [seatPrice, setPrice] = useState(-1);
  const [scale, setScale] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [transform, setTransform] = useState();
  const [offset, setOfset] = useState({
    x: 0,
    y: 0,
  });
  const [activeSeat, setActiveSeat] = useState({ seat: null, price: -1 });
  const [holdSeats, setHoldSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [buyTicket, setBuyTicket] = useState(false);
  const [minmax, setMinMax] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });
  const [seatData, setSeatData] = useState(null);
  const [mousePos, setMousePos] = useState({
    down: {},
    up: {},
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("ticket:hold", (seats) => {
      setHoldSeats(seats);
    });

    socket.on("ticket:release", (seats) => {
      setHoldSeats(seats);
    });

    socket.on("ticket:booked", (seats) => {
      setBookedSeats(seats);
    });

    HttpService.getSeats("cinemaA").then((response) => {
      setSeatData(response.data);
      setHoldSeats(response.data.hold || []);
      setBookedSeats(response.data.booked || []);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const handleMinus = () => {
    setScale((s) => s - SCALE_INCREMENT);
  };

  const handlePlus = () => {
    setScale((s) => s + SCALE_INCREMENT);
  };

  function getMousePosition(evt) {
    var CTM = ref.current.parentNode.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }

  const handleMouseDown = (e) => {
    setInfoCard({
      x: -1,
      y: -1,
    });
    setDragActive(true);
    let transforms = ref.current.transform.baseVal;
    // Ensure the first transform is a translate transform
    if (
      transforms.length === 0 ||
      transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
    ) {
      // Create an transform that translates by (0, 0)
      var translate = ref.current.parentNode.createSVGTransform();
      translate.setTranslate(0, 0);
      // Add the translation to the front of the transforms list
      ref.current.transform.baseVal.insertItemBefore(translate, 0);
    }

    setTransform(transforms.getItem(0));
    setOfset({
      x: getMousePosition(e).x - transforms.getItem(0).matrix.e,
      y: getMousePosition(e).y - transforms.getItem(0).matrix.f,
    });

    setMousePos({ ...mousePos, up: getMousePosition(e) });

    let bbox = ref.current.parentNode.getBBox();
    setMinMax({
      minX: boundaryX1 - bbox.x,
      maxX: boundaryX2 - bbox.x - bbox.width,
      minY: boundaryY1 - bbox.y,
      maxY: boundaryY2 - bbox.y - bbox.height,
    });
  };

  const handleMouseMove = (e) => {
    if (dragActive) {
      var coord = getMousePosition(e);
      let dx = coord.x - offset.x;
      let dy = coord.y - offset.y;

      transform.setTranslate(dx, dy);
    }
  };

  const handleMouseUp = (e) => {
    console.log("up");
    setMousePos({ ...mousePos, down: getMousePosition(e) });
    setDragActive(false);
  };

  /**
   * hold the seat for x minutes
   * @param {*} seat
   */
  const handleSeatClick = async (seat) => {
    console.log(mousePos);

    // if a seat already on hold is clicked then do nothing
    if (holdSeats.indexOf(seat.seat) >= 0 || bookedSeats.indexOf(seat.seat) >= 0 ) {
      return;
    }

    // if another set is clicked while one is active then cancel that one
    if (activeSeat.seat && activeSeat.seat !== seat.seat) {
      await HttpService.releaseSeat({ seat: activeSeat.seat });
    }

    HttpService.holdSeat({ seat: seat.seat, price: seat.price }).then(
      (response) => {
        setBuyTicket(true);
        setActiveSeat({ ...seat });
      }
    );
  };

  const handleClose = () => {
    setBuyTicket(false);
    HttpService.releaseSeat({ seat: activeSeat.seat }).then((response) =>
      console.log(response)
    );
  };

  const handleExpired = () => {
    HttpService.releaseSeat({ seat: activeSeat.seat }).then((response) =>
      console.log(response)
    );
  };

  return (
    <div className="App">
      <Header>Ticket Express</Header>
      {seatData ? (
        <MapContainer>
          <span>
            <ZoomControls onPlus={handlePlus} onMinus={handleMinus} />
            <SeatingContainer
              id="seatings"
              viewBox="0 0 1280 720"
              scale={scale}
            >
              <g
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={ref}
              >
                <path
                  id="screen"
                  d="M43.94,57.773C90,45.424,339.853,36,660,36c295.889,0,542.08,9.159,593.94,21.25"
                />
                <text id="screen_title" x="640" y="80">
                  <tspan x="640">SCREEN</tspan>
                </text>

                {seatData.seating.grouping.map((seat, i) => (
                  <Seating
                    key={i}
                    seat={seat}
                    render={(s, idx) => (
                      <OneSeat                        
                        setInfoCard={setInfoCard}
                        setSeatNumber={setSeatNumber}
                        setPrice={setPrice}
                        key={idx}
                        id={s.id}
                        price={s.price}
                        coords={s.coords}
                        onSeatClick={handleSeatClick}
                        activeSeat={activeSeat}
                        holdSeats={holdSeats}
                        bookedSeats={bookedSeats}
                        dragActive={dragActive}
                      />
                    )}
                  />
                ))}
              </g>
            </SeatingContainer>
          </span>
        </MapContainer>
      ) : (
        <h1>Arranging seats...</h1>
      )}
      <InfoCard position={infoCard}>
        <InfoCardContent>
          <span>Seat: {seatNumber}</span>
          {seatPrice > 0 && <span>Price: ${seatPrice}</span>}
        </InfoCardContent>
      </InfoCard>

      <AppState>
        <SideBar
          show={buyTicket}
          onClose={handleClose}
          seat={activeSeat}
          onExpired={handleExpired}
        />
      </AppState>
        <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
