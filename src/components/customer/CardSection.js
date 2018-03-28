import { db } from "../../config";
import React, { Component } from "react";
import { CardNumberElement, CardExpiryElement } from "react-stripe-elements";
import { CardCVCElement, PostalCodeElement } from "react-stripe-elements";
import { FlatButton } from "material-ui";

const handleChange = change => {
  // console.log("[change]", change);
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
    this.state = {
      cardSaved: false
    };
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
          console.log("Token on adding card", token);
          let source = token.token.id;
          await db // updating user with token
            .collection("Users")
            .doc(`${doc_id}/stripe_source/tokens`)
            .set({ token_id: source }, { merge: true });

          this.setState(_ => ({
            cardSaved: true
          }));
        });
    } catch (err) {
      console.log(err);
    }
  };

  editForm = event => {
    event.preventDefault();
    console.log("Editing existing card info");
  };

  deleteCard = event => {
    event.preventDefault();
    console.log("Deleting card...");
  };

  renderCardForm = () => {
    if (!this.state.cardSaved) {
      return (
        <div>
          <h6>Add a payment method</h6>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Card number
                <CardNumberElement
                  onChange={handleChange}
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                Expiration date
                <CardExpiryElement
                  onChange={handleChange}
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                CVC
                <CardCVCElement
                  onChange={handleChange}
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                Postal code
                <PostalCodeElement
                  onChange={handleChange}
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <FlatButton
                label="Save Card"
                primary={true}
                onClick={this.handleSubmit}
              />
            </div>
          </form>
        </div>
      );
    }
    if (this.state.cardSaved) {
      return (
        <div>
          <h6>Edit payment details</h6>
          <FlatButton label="Edit" primary={true} onClick={this.editForm} />
          <FlatButton label="Delete" primary={true} onClick={this.deleteCard} />
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderCardForm()}</div>;
  }
}

export default CardSection;
