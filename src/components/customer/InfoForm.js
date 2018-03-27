import React, { Component } from "react";
import { injectStripe } from "react-stripe-elements";

import CardSection from "./CardSection";

class InfoForm extends Component {
  render() {
    /* inject stripe object to CardSection */
    return (
      <CardSection userObj={this.props.userObj} stripe={this.props.stripe} />
    );
  }
}

export default injectStripe(InfoForm);
