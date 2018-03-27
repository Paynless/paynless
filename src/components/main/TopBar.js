import React, { Component } from "react";
import { Logo } from "../index";
import { AppBar, FlatButton } from "material-ui";
import { logout } from "../../helpers";

export default class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logoutPressed: false,
    }
  }

  render() {
    const { userObj } = this.props
    const iconStyleRight = {
      display: "flex",
      alignItems: "center",
      marginTop: "0"
    }
    const style = {
      height: "64px",
      flexShrink: 0,
      background: "linear-gradient(to bottom right, #0a2009, #0d2d0b)"
    }
    const authButtons = userObj ? (
      <FlatButton
        label="Logout"
        onClick={_ => logout() }
        style={{ color: "#fff" }}
      />
    ) : null;

    const topbarButtons = <div>{authButtons}</div>;
    return (
      <AppBar
      title={<Logo />}
      iconElementRight={topbarButtons}
      iconStyleRight={iconStyleRight}
      style={style}
      onLeftIconButtonTouchTap={this.props.toggleMenu}
      onTitleTouchTap={_ => this.props.history.push('/')}
     />
    )
  }
}
