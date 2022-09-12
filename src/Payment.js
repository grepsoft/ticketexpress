import { useRef, useState, useEffect } from "react";
import dropin from "braintree-web-drop-in";
import { ErrorMessageContainer, Input, PaymentContainer } from "./styles";
import { useAppState } from "./state/AppState";
import { HttpService } from "./service/httpService";
import { formatAmount } from "./utils";
import { toast } from "react-toastify";
import { Loader } from "./loader";

export const Payment = ({ seat, expired }) => {
  const btRef = useRef();
  const [emailInput, setEmailInput] = useState();
  const { state, dispatch } = useAppState();
  const [braintreeInstance, setBrainTreeInstance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePay = ({expired}) => {
    if (!emailInput) {
      setErrorMessage("Email is missing");
      return;
    }

    braintreeInstance.requestPaymentMethod(async (err, payload) => {
      dispatch({ type: "processingstart" });

      if (err) {
        console.log(err);
        setErrorMessage("Failed to process payment");
        dispatch({ type: "processingend" });
        return;
      }

      // process
      const paymentResponse = await HttpService.processPayment({
        nonce: payload.nonce,
        email: emailInput,
        seat: seat.seat,
        price: formatAmount(seat.price),
      });

      const { code, message, error } = { ...paymentResponse };

      dispatch({ type: "processingend" });

      if (code === 0) {
        toast.success(message);
        dispatch({
          type: "paymentsuccess",
        });
      } else {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    setErrorMessage(null);
    setEmailInput(null);
    if (state.buy && !braintreeInstance) {
      dropin
        .create({
          authorization: "sandbox_248ztnxz_db25nmjxpdzpr5th",
          container: btRef.current,
        })
        .then((instance) => {
          setBrainTreeInstance(instance);
        })
        .catch((err) => console.log(err));
    }

    if (!state.buy && braintreeInstance) {
      braintreeInstance
        .teardown()
        .then(() => {
          setBrainTreeInstance(null);
        })
        .catch((err) => console.log(err));
    }
  }, [state.buy]);

  const handleEmailInput = (e) => {
    setEmailInput(e.target.value);
  };

  return (
    <PaymentContainer>
      {expired ? null : (
        <>
          {errorMessage && (
            <ErrorMessageContainer>{errorMessage}</ErrorMessageContainer>
          )}

          {braintreeInstance && (
            <Input placeholder="Email" onChange={handleEmailInput} />
          )}
          <div ref={btRef}></div>

          {state.processing ? (
            <Loader />
          ) : (
            braintreeInstance && (
              <button onClick={handlePay} className="button-pay">
                Pay now
              </button>
            )
          )}
        </>
      )}
    </PaymentContainer>
  );
};
