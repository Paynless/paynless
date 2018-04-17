import React, { Component } from "react";
import { Router } from "react-router-dom";
import {
  Routes,
  SplashScreen,
  Menu,
  TopBar,
  BottomNavigationBar,
  history
} from "../index";
import { fetchAllMerchants } from "../../helpers";
import { withAuth } from "fireview";
import { db } from "../../config";

class App extends Component {
  state = {
    allOpenMerchants: [],
    openMenu: false,
    userObj: null,
    isLoading: true
  };
  async componentDidMount() {
    try {
      const allOpenMerchants = await fetchAllMerchants();
      this.setState({ allOpenMerchants});
    } catch (err) {
      console.log(err);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: nextUser } = nextProps.withAuth
    const { user: prevUser } = this.props.withAuth
    if (nextUser === prevUser) {
      return;
    }

    this.removeUserListener && this.removeUserListener()
    if (!nextUser) return this.setState({ userObj: null });
    
    this.removeUserListener = db
      .collection("Users")
      .doc(nextUser.uid)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const userObj = snapshot.data();
          this.setState({ userObj });
        }
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.withAuth.ready && nextState.allOpenMerchants.length > 0) {
      if (
        !this.props.withAuth.ready ||
        this.state.allOpenMerchants.length === 0
      ) {
        this.setState({ isLoading: false });
      }
    }
  }

  componentWillUnmount() {
    this.removeUserListener();
  }

  toggleMenu = _ => this.setState({ openMenu: !this.state.openMenu });

  handleClose = _ => this.setState({ openMenu: false });

  render() {
    const { allOpenMerchants, userObj, isLoading } = this.state;

    return isLoading ? (
      <SplashScreen />
    ) : (
      <Router history={history}>
        <div className="fullheight">
          <div>
            <TopBar
              userObj={userObj}
              history={history}
              toggleMenu={this.toggleMenu}
            />
            <Menu
              history={history}
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
          <BottomNavigationBar userObj={userObj} />
        </div>
      </Router>
    );
  }
}

export default withAuth(App);
