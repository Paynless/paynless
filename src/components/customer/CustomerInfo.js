import React, { Component } from "react";
import { Elements } from "react-stripe-elements";
import InjectedInfoForm from "./InfoForm";

class CustomerInfo extends Component {
  render() {
    return (
      <Elements>
        <InjectedInfoForm />
      </Elements>
    );
  }
}

export default CustomerInfo;
