import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import { SplashScreen, Menu, Logo, Login, Register, AdminHome, AdminSingleTab, BottomNavigationBar,history} from "../index";
import {logout, fetchAllMerchants} from '../../helpers'
import { AppBar, FlatButton } from "material-ui";
import { Routes } from "./index";
import { withAuth } from 'fireview';

class App extends Component {
  state = {
    authed: false,
    loading: true,
    allOpenMerchants: [],
    openMenu: false
  };
  async componentDidMount() {
   const allOpenMerchants = fetchAllMerchants();
    this.setState(_ => ({
      allOpenMerchants
    }));
  }

  toggleMenu = _ => this.setState(_ => ({ openMenu: !this.state.openMenu }));

  handleClose = _ => this.setState(_ => ({ openMenu: false }));

  render() {
    const { user } = this.props.withAuth || null;
    console.log(user)

    const authButtons = !!user ? (
      <FlatButton
        label="Logout"
        onClick={() => {
          logout();
        }}
        style={{ color: "#fff" }}
      />
    ) : null;

    const topbarButtons = <div>{authButtons}</div>;

    const tabData = {
      0: {
        path: !!user ? "/" : "/login",
        icon: !!user ? "plus-circle" : "sign-in",
        label: !!user ? "New Tab" : "Login"
      },
      1: {
        path: !!user ? "/open-tabs" : "/register",
        icon: !!user ? "sticky-note" : "user-plus",
        label: !!user ? "Open Tabs" : "Register"
      }
    };

    const { allOpenMerchants } = this.state;


    return this.state.loading === true && allOpenMerchants.length === 0 ? (
      <SplashScreen />
    ) : (
      <Router history={history}>
        <div className="fullheight">
          <div>
            <AppBar
              title={<Logo />}
              iconElementRight={topbarButtons}
              iconStyleRight={{
                display: "flex",
                alignItems: "center",
                marginTop: "0"
              }}
              style={{
                height: "64px",
                flexShrink: 0,
                background: "linear-gradient(to bottom right, #0a2009, #0d2d0b)"
              }}
              onLeftIconButtonTouchTap={this.toggleMenu}
            />
            <Menu
              user={!!user}
              toggleMenu={this.toggleMenu}
              openMenu={this.state.openMenu}
              handleClose={this.handleClose}
            />
            <div className="splashbox" />
          </div>
          <BottomNavigationBar data={tabData} />
          <Routes allOpenMerchants={allOpenMerchants} />
        </div>
      </Router>
    );
  }
}

export default withAuth(App);
