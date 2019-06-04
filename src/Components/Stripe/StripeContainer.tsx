import React from "react";
import { Elements, injectStripe, StripeProvider } from "react-stripe-elements";
import { Container } from "../Shared";
import StripePresenter from "./StripePresenter";

interface IProps {
  submit: () => void;
}

class StripeContainer extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
      <Container>
        <StripeProvider apiKey="pk_test_NAXwKLUdVv6N03p7MfZo4gF000xtVHo3ob">
          <div className="example">
            <h1>React Stripe Elements Example</h1>
            <Elements>
              <StripePresenter submit={this.submit} />
            </Elements>
          </div>
        </StripeProvider>
      </Container>
    );
  }
}

export default injectStripe(StripeContainer);
