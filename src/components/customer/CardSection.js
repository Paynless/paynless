import React, { Component } from "react";
import { CardElement } from "react-stripe-elements";

const createOptions = fontSize => {
  return {
    style: {
      base: {
        fontSize,
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, Menlo, monospace",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#9e2146"
      }
    }
  };
};

class CardSection extends Component {
  render() {
    return (
      <label>
        Card details
        <CardElement />
      </label>
    );
  }
}

export default CardSection;

// style={{ base: { fontSize: "18px" } }}
