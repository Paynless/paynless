import React, { Component } from "react";
import { findOrCreateMerchant, setErrorMsg,} from "../../helpers";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { firestore } from "../../config";

export default class RegisterVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerError: null,
      name: "",
      vicinity: "",
      hours: {}
    };
  }

  handleSubmit = async event => {
    try {
      event.preventDefault();
      const { name, vicinity, hours } = this.state;
      const data = {
        name,
        vicinity,
        location: new firestore.GeoPoint(40.7050604, -74.00865979999999),
        hours
      };
      await findOrCreateMerchant(null, data);
    } catch (err) {
      this.setState(setErrorMsg(err));
    }
  };

  handleUpdateInput = searchText => {
    this.setState({
      searchText: searchText
    });
  };

  handleNewRequest = () => {
    this.setState({
      searchText: ""
    });
  };
  onChange = vicinity => this.setState(_ => ({ vicinity, registerError: "" }));

  render() {
    
    return (
      <form onSubmit={this.handleSubmit} style={style.container}>
        <h3>Register Your Business With Paynless</h3>

        <TextField
          hintText="Ex. Milan's Pizza Palace"
          floatingLabelText="Business Name"
          onChange={(event, newValue) =>
            this.setState(_ => ({ name: newValue, registerError: "" }))
          }
        />
        <br />
        <TextField
          hintText="Ex. 5 Hanover Square"
          floatingLabelText="Street Address"
          onChange={(event, newValue) =>
            this.setState(_ => ({ vicinity: newValue, registerError: "" }))
          }
        />
        <br />
        {this.state.registerError && (
          <div className="alert alert-danger" role="alert">
            <span
              className="glyphicon glyphicon-exclamation-sign"
              aria-hidden="true"
            />
            <span className="sr-only">Error:</span>
            &nbsp;{this.state.registerError}
          </div>
        )}
        <RaisedButton
          label="Register"
          primary={true}
          style={style.raisedBtn}
          type="submit"
        />
      </form>
    );
  }
}

const raisedBtn = {
  margin: 15
};

const container = {
  textAlign: "center"
};

const style = {
  raisedBtn,
  container
};
