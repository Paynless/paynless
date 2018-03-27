import { db } from "../../config";
import React, { Component } from "react";
import { CardNumberElement, CardExpiryElement } from "react-stripe-elements";
import { CardCVCElement, PostalCodeElement } from "react-stripe-elements";
import { FlatButton } from "material-ui";

const handleBlur = () => {
  // console.log("[blur]");
};

const handleChange = change => {
  // console.log("[change]", change);
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

  handleSubmit = async event => {
    event.preventDefault();
    console.log("[click]");

    const { userObj } = this.props;
    const { stripe } = this.props;
    try {
      // listening to user
      await db
        .collection("Users")
        .where("uid", "==", userObj.uid)
        .onSnapshot(async doc => {
          let doc_id = doc.docs[0].id;
          const token = await stripe.createToken();
          let source = token.token.id;
          await db // updating user with token
            .collection("Users")
            .doc(`${doc_id}/stripe_source/tokens`)
            .set({ token_id: source }, { merge: true });
        });
    } catch (err) {
      console.log(err);
    }
  };

  editForm = event => {};

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
          <FlatButton label="Edit" primary={true} onClick={this.editForm} />
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

export default CardSection;
