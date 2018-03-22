import React, { Component } from "react";
import { auth, isValidDOB, isValidEmail, setErrorMsg } from "../../helpers";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
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
      dob: "",
      invalidEmailPw: false,
      invalidName: false,
      invalidDOB: false
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password, firstName, lastName, dob } = this.state;
    if (!isValidEmail(email) || password.length < 4) {
      this.setState(_ => ({
        invalidEmailPw: true
      }));
      return;
    } else if (firstName.length < 3 || lastName.length < 3) {
      this.setState(_ => ({
        invalidName: true
      }));
      return;
    } else if (!isValidDOB(dob)) {
      this.setState(_ => ({
        invalidDOB: true
      }));
      return;
    }
    auth(email, password, firstName, lastName, dob).catch(err =>
      this.setState(setErrorMsg(err))
    );
  };

  render() {
    const action = [
      <FlatButton
        label="Try Credientials Again"
        primary={true}
        onClick={evt =>
          this.setState(_ => ({
            invalidEmailPw: false
          }))
        }
      />,
      <FlatButton
        label="Try Name Again"
        primary={true}
        onClick={evt =>
          this.setState(_ => ({
            invalidName: false
          }))
        }
      />,
      <FlatButton
        label="Try DOB Again"
        primary={true}
        onClick={evt =>
          this.setState(_ => ({
            invalidDOB: false
          }))
        }
      />
    ];
    return (
      <form onSubmit={this.handleSubmit} style={style.container}>
        <h3>Register</h3>
        <TextField
          hintText="Enter your first name"
          floatingLabelText="First Name"
          onChange={(event, newValue) => this.setState({ firstName: newValue })}
        />
        <br />
        <TextField
          hintText="Enter your last name"
          floatingLabelText="Last Name"
          onChange={(event, newValue) => this.setState({ lastName: newValue })}
        />
        <br />
        <TextField
          hintText="Enter your date of birth"
          floatingLabelText="Date of Birth MM/DD/YYYY"
          onChange={(event, newValue) => this.setState({ dob: newValue })}
        />
        <br />
        <TextField
          hintText="Enter your Email"
          floatingLabelText="Email"
          onChange={(event, newValue) => this.setState({ email: newValue })}
        />
        <br />
        <TextField
          type="password"
          hintText="Enter your Password"
          floatingLabelText="Password"
          onChange={(event, newValue) => this.setState({ password: newValue })}
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
        <Dialog
          actions={action[0]}
          modal={false}
          open={this.state.invalidEmailPw}
          onRequestClose={_ => this.setState(_ => ({ invalidEmailPw: false }))}
        >
          Please Enter A Valid Email Or Password
        </Dialog>

        <Dialog
          actions={action[1]}
          modal={false}
          open={this.state.invalidName}
          onRequestClose={evt => this.setState(_ => ({ invalidName: false }))}
        >
          Please Enter A Valid First And Last Name
        </Dialog>
        <Dialog
          actions={action[2]}
          modal={false}
          open={this.state.invalidDOB}
          onRequestClose={evt => this.setState(_ => ({ invalidDOB: false }))}
        >
          Please Enter A Valid Date Of Birth
        </Dialog>
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
