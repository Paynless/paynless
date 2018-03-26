import { db, firebaseAuth } from "../../config";
import React, { Component } from "react";
import { CardNumberElement, CardExpiryElement } from "react-stripe-elements";
import { CardCVCElement, PostalCodeElement } from "react-stripe-elements";
import { FlatButton } from "material-ui";
import { withAuth } from "fireview";

const handleBlur = () => {
  // console.log("[blur]");
};

const handleChange = change => {
  // console.log("[change]", change);
};

const handleClick = event => {
  console.log("[click]");
  console.log("event in click", event.target);
};

const handleFocus = () => {
  // console.log("[focus]");
};

const handleReady = () => {
  console.log("[ready]");
};

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
  constructor(props) {
    super(props);
  }

  handleSubmit = event => {
    event.preventDefault();
    const { user } = this.props.withAuth;
    const { stripe } = this.props;

    let doc_id;

    // for testing
    // db
    //   .collection("users")
    //   .where("uid", "==", user.uid)
    //   .get()
    //   .then(item => item.forEach(doc => console.log(doc.data())));

    db
      .collection("users")
      .where("uid", "==", user.uid)
      .onSnapshot(doc =>
        doc.docs.map(doc => {
          doc_id = doc.id;
          stripe.createToken().then(({ token }) => {
            console.log("Received Stripe token:", token);
            db
              .collection("users")
              .doc(`${doc_id}/stripe_source/tokens`)
              .set({ token_id: token.id }, { merge: true });


          });
        })
      );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>
            Card number
            <CardNumberElement
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onReady={handleReady}
              {...createOptions(this.props.fontSize)}
            />
          </label>
        </div>
        <div>
          <label>
            Expiration date
            <CardExpiryElement
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onReady={handleReady}
              {...createOptions(this.props.fontSize)}
            />
          </label>
        </div>
        <div>
          <label>
            CVC
            <CardCVCElement
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onReady={handleReady}
              {...createOptions(this.props.fontSize)}
            />
          </label>
        </div>
        <div>
          <label>
            Postal code
            <PostalCodeElement
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onReady={handleReady}
              {...createOptions(this.props.fontSize)}
            />
          </label>
        </div>
        <div>
          <FlatButton
            label="Save Info"
            primary={true}
            onClick={this.handleSubmit}
          />
        </div>
      </form>
    );
  }
}

export default withAuth(CardSection);
