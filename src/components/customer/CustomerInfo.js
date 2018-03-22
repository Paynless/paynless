import React, { Component } from "react";
// import { db, firebaseAuth } from "../../config";
// import { withAuth } from "fireview";
import { Elements } from "react-stripe-elements";
import InjectedInfoForm from "./InfoForm";

class CustomerInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Elements>
        <InjectedInfoForm />
      </Elements>
    );
  }
}

export default CustomerInfo;
