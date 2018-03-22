import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";

import CardSection from "./CardSection";

class InfoForm extends Component {
  render() {
    return (
      <CardSection />
    );
  }
}

export default injectStripe(InfoForm);
