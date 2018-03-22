import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";

import CardSection from "./CardSection";

class InfoForm extends Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.stripe.createToken({name: 'Alfonso Millan'})
      .then(({token}) => {
        console.log('Received Stripe token:', token);
      })
  }
  render() {
    return (
      <form>
        <CardSection />
        {/*<button>Save</button>*/}
      </form>
    );
  }
}

export default injectStripe(InfoForm);
