import React, { Component } from "react";
import { Router } from "react-router-dom";
import {
  Routes,
  SplashScreen,
  Menu,
  Logo,
  BottomNavigationBar,
  history
} from "../index";
import { logout, fetchAllMerchants, fetchUser } from "../../helpers";
import { AppBar, FlatButton } from "material-ui";
import { withAuth } from "fireview";
import { db } from "../../config";

class App extends Component {
  state = {
    allOpenMerchants: [],
    openMenu: false,
    userObj: {}
  };
  async componentDidMount() {
    try {
      const allOpenMerchants = await fetchAllMerchants();
      this.setState(_ => ({
        allOpenMerchants
      }));
    } catch (err) {
      console.log(err);
    }
  }

  async componentWillReceiveProps(nextProps) {
    try {
      if (!!nextProps.withAuth.user) {
        const { user } = nextProps.withAuth;
        if (!user.isAnonymous) {
          this.removeUserListener = await db
            .collection("users")
            .where("uid", "==", user.uid)
            .onSnapshot(snapshot => {
              const userObj = snapshot.docs[0].data();
              this.setState(_ => ({ userObj }));
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this.removeUserListener();
  }

  toggleMenu = _ => this.setState(_ => ({ openMenu: !this.state.openMenu }));

  handleClose = _ => this.setState(_ => ({ openMenu: false }));

  render() {
    const { user } = this.props.withAuth;

    const { allOpenMerchants, userObj } = this.state;
    const loaded = userObj.hasOwnProperty('email') && allOpenMerchants.length > 0;

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

    return !loaded ? (
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
              userObj={userObj}
              toggleMenu={this.toggleMenu}
              openMenu={this.state.openMenu}
              handleClose={this.handleClose}
            />
            <div className="splashbox" />
          </div>
          <div className="container d-flex justify-content-center mt-3 scrollable">
            <div className="row">
              <Routes allOpenMerchants={allOpenMerchants} userObj={userObj} />
            </div>
          </div>
          <BottomNavigationBar data={tabData} />
        </div>
      </Router>
    );
  }
}

export default withAuth(App);
