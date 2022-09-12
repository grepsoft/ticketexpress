import styled, { css } from "styled-components";
import { lighten } from "polished";
import { pulse, slideLeft } from "./animation";

export const MapContainer = styled.div`
  position: relative;
`;

export const SeatingContainer = styled.svg`
  transform: ${(props) => `scale(${props.scale}) `};
  transform-origin: center;
  overflow: visible; /* removing this will cause the svg to cut off */
  width: 100%;
  height: 360px;

  @media (min-width: 62rem) {
    height: 720px;
  }
  transition: 0.3s;
`;

export const Seat = styled.rect`
  fill: ${(props) => props.booked !== -1 ? '#e7e7e7' : '#00adb5'};
  cursor: pointer;
  &:hover {
    fill: ${lighten(0.1, "#00adb5")};
  }
  animation: ${(props) => props.hold !== -1 && css`${pulse} 1s infinite alternate`};
`;

export const InfoCard = styled.div`
  position: absolute;
  display: ${(props) =>
    props.position.x > 0 && props.position.y > 0 ? "block" : "none"};
  background: #222831;
  color: #fff;
  width: 10%;
  height: 50px;
  padding: 5px;
  border-radius: 4px;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y - 60}px;
  -webkit-box-shadow: 5px 4px 15px -1px rgba(0,0,0,0.82); 
box-shadow: 5px 4px 15px -1px rgba(0,0,0,0.82);
`;

export const InfoCardContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px;
`;

export const Header = styled.div`
  width: 100%;
  background: #000;
  color: #fff;
  padding: 10px 0px;
  font-size: 2rem;
  text-align: center;
  z-index: 999;
`;

/******************************************
 * Zoom Controls
 ******************************************/
export const ZoomControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  bottom: auto;
  color: #333;
  cursor: pointer;
  font-size: 18px;
  overflow: hidden;
  position: absolute;
  right: 0px;
  top: 10%;
  z-index: 1000;
  box-shadow: 0 1px 2px 0 rgb(53 65 74 / 30%);
`;

const ZoomButton = styled.div`
  padding: 4px;
  font-family: "cyprus";
  text-align: center;
  font-size: 1.5rem;
  margin: 0 0.4em;
  font-weight: bold;
  &:hover {
    color: #00adb5;
  }
`;

export const ZoomPlusButton = styled(ZoomButton)`
    border-bottom: 1px solid #e6e6e6;
    font-size: 2rem;
    &:before {
        content: ' \\002B';
    }
`;
export const ZoomMinusButton = styled(ZoomButton)`

  &:before {    
    content: ' \\007C'};
    transform: rotate(-90deg)
  }
`;

/******************************************
 * Sidebar
 ******************************************/
 export const TicketRow = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 12px 16px;
 border-bottom: 1px solid #aaa;
 border-top: 1px solid #aaa;
`;

export const TimerContainer = styled.div`
 display: flex;
 position: relative;
 justify-content: center;
 align-items: center;
 color: #ff5200;
 font-size: 2rem;
 padding: 2px;
 &:before {
   content: "";
   position: absolute;
   background: red;
   width: 100%;
   height: 100%;
   transform: scaleX(${(props) => props.ticker});
   transform-origin: left;
   opacity: 0.5;
   transition: 1s;
 }
`;

export const SideBarContainer = styled.div`   
    display: ${(props) => props.show ? 'flex' : 'none'};
    flex-direction: column;
    left: 0;
    top: 60px;
    width: 320px;
    height: 100vh;
    box-shadow: 2px 2px 3px #000;
    background: #e6e6e6;
    margin: 0;
    animation: ${slideLeft} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    position: absolute;
    box-shadow: -1px 0px 2px #eee;
`;

export const Price = styled.p`
  font-weight: bold;
  display: inline-block;
`;

/******************************************
 * Payment
 ******************************************/
export const PaymentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background: #0a222831;
`;

export const Input = styled.input`    
    padding: 8px 4px;
    border: none;
    border-radius: 4px;
    font-size: 1.125rem;
    width: 100%;
    margin: 4px 2px;
    ::placeholder {
        color: #c0c0c0;
    }
`;

export const ErrorMessageContainer = styled.div`
    padding: 10px;
    background: #ec493a;
    color: #fff;
    width: 100%;
`;