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

  async componentDidMount() {

  }

  handleSubmit = async event => {
    event.preventDefault();
    const { user } = this.props.withAuth;
    const { stripe } = this.props;
    try {
      const userListener = await db
        .collection("Users")
        .where("uid", "==", user.uid)
        .onSnapshot(async doc => {
          let doc_id = doc.docs[0].id;
          const token = await stripe.createToken();
          console.log("token", token);
          let source = token.token.id;
          const updateUserWithToken = await db
            .collection("Users")
            .doc(`${doc_id}/stripe_source/tokens`)
            .set({ token_id: source }, { merge: true });
        });
    } catch (err) {
      console.log(err);
    }
  };

  editForm = event => {

  }

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
            label="Edit"
            primary={true}
            onClick={this.editForm}
          />
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
