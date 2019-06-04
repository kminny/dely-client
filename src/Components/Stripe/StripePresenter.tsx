import React from "react";
import { CardElement } from "react-stripe-elements";

interface IProps {
  submit: any;
}

const StripePresenter: React.SFC<IProps> = ({ submit }) => (
  <div className="checkout">
    <p>Would you like to complete the purchase?</p>
    <CardElement />
    <button onClick={submit}>Send</button>
  </div>
);

export default StripePresenter;
