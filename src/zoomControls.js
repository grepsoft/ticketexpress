import { ZoomControlsContainer, ZoomMinusButton, ZoomPlusButton } from "./styles";


function ZoomControls({onPlus, onMinus}) {
    return (
        <ZoomControlsContainer>
            <ZoomPlusButton onClick={onPlus} role={"button"}/>
            <ZoomMinusButton onClick={onMinus} role={"button"}/>
        </ZoomControlsContainer>
    );
}

export default ZoomControls;