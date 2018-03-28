import React, { Component } from "react";
import { auth, isValidEmail, setErrorMsg } from "../../helpers";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerError: null,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password, firstName, lastName } = this.state;
    if (!isValidEmail(email) || password.length < 6) {
      this.setState(setErrorMsg(Error('Email Must Be Valid And Password Must Be At Least 6 Characters')));
      return;
    } else if (!firstName.length || !lastName.length) {
      this.setState(setErrorMsg(Error('First And Last Name Cannot Be Left Blank')));
      return;
    }

    auth(email, password, firstName, lastName).catch(err => this.setState(setErrorMsg(err)));
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={style.container}>
        <h3>Register</h3>
        <TextField
          hintText="Enter your first name"
          floatingLabelText="First Name"
          onChange={(event, newValue) => this.setState({ firstName: newValue, registerError: "", })}
        />
        <br />
        <TextField
          hintText="Enter your last name"
          floatingLabelText="Last Name"
          onChange={(event, newValue) => this.setState({ lastName: newValue, registerError: "", })}
        />
        <br />
        <TextField
          hintText="Enter your Email"
          floatingLabelText="Email"
          onChange={(event, newValue) => this.setState({ email: newValue, registerError: "" })}
        />
        <br />
        <TextField
          type="password"
          hintText="Enter your Password"
          floatingLabelText="Password"
          onChange={(event, newValue) => this.setState({ password: newValue, registerError: "" })}
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
