import { db } from "../../config";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CardNumberElement, CardExpiryElement } from "react-stripe-elements";
import { CardCVCElement, PostalCodeElement } from "react-stripe-elements";
import { FlatButton, CircularProgress } from "material-ui";

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
      cardSaved: false,
      cardIsLoaded: false,
      lastFour: "",
      brand: "",
      cardId: "",
    };
  }

  handleChange = (element, name) => {
    if (!element.empty && element.complete) {
      this.setState({ [name]: true });
    } else {
      this.setState({ [name]: false });
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("[click]");
    const { userObj } = this.props;
    const { stripe } = this.props;

    try {
      // listening to user
      this.removeListener = await db
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
            cardSaved: true,
            cardIsLoaded: true,
            lastFour: token.token.card.last4,
            brand: token.token.card.brand,
            cardId: token.token.card.id
          }));
        });
    } catch (err) {
      console.log(err);
    }
  };

  editForm = event => {
    event.preventDefault();
    console.log("Editing existing card info");
    this.setState({
      cardSaved: false,
      card_number: false,
      card_expiration: false,
      card_cvc: false,
      card_postal: false
    });
  };

  componentDidMount() {
    const { userObj } = this.props;

    db // check if token exists
      .collection("Users")
      .doc(`${userObj.uid}/stripe_source/tokens`)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({ cardSaved: true, cardIsLoaded: true });
        } else {
          this.setState({ cardSaved: false, cardIsLoaded: true });
        }
      });
  }

  componentWillUnmount() {
    this.removeListener();
  }

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
                  onChange={element =>
                    this.handleChange(element, "card_number")
                  }
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                Expiration date
                <CardExpiryElement
                  onChange={element =>
                    this.handleChange(element, "card_expiration")
                  }
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                CVC
                <CardCVCElement
                  onChange={element => this.handleChange(element, "card_cvc")}
                  onReady={handleReady}
                  {...createOptions(this.props.fontSize)}
                />
              </label>
            </div>
            <div>
              <label>
                Postal code
                <PostalCodeElement
                  onChange={element =>
                    this.handleChange(element, "card_postal")
                  }
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
                disabled={
                  !this.state["card_number"] ||
                  !this.state["card_expiration"] ||
                  !this.state["card_cvc"] ||
                  !this.state["card_postal"]
                }
              />
            </div>
          </form>
        </div>
      );
    }
    if (this.state.cardSaved) {
      return (
        <div>
          <div>
            <h6>Edit payment details</h6>
            <label>
              {
                this.state.brand && this.state.lastFour
                  ? <p>{this.state.brand} Card ending in {this.state.lastFour}</p>
                  : <p>Previously saved card...</p>
              }

            </label>
            <FlatButton label="Edit" primary={true} onClick={this.editForm} />
          </div>
          <div>
            <Link to="/">
              <p className="home-screen-btn">
              <FlatButton
                label="Home"
                primary={true}
              />
              </p>
            </Link>
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
    {
      this.state.cardIsLoaded
       ? this.renderCardForm()
       : <CircularProgress size={80} thickness={10} />
    }
    </div>
    )
  }
}

export default CardSection;
