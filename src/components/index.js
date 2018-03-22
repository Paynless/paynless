import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import { CheckIn, OpenTabs, BottomNavigationBar } from "./customer";
import { Login, Register } from "./auth";
import { logout } from "../helpers";
import { firebaseAuth } from "../config";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import history from "./history";
import { fetchAllMerchants } from "../helpers";

function PrivateRoute({ component: Component, authed, allOpenMerchants, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => 
        authed === true ? (
          <Component allOpenMerchants={allOpenMerchants} {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
    allOpenMerchants: []
  };
  async componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState(_=> ({
          authed: true,
          loading: false
        }));
      } else {
        this.setState(_=> ({
          authed: false,
          loading: false
        }));
      }
    });
    const allOpenMerchants = await fetchAllMerchants();
    this.setState(_=>({
      allOpenMerchants
    }));
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    const authButtons = this.state.authed ? (
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
        path: this.state.authed ? "/" : "/login",
        icon: this.state.authed ? "plus-circle" : "sign-in",
        label: this.state.authed ? "New Tab" : "Login"
      },
      1: {
        path: this.state.authed ? "/open-tabs" : "/register",
        icon: this.state.authed ? "sticky-note" : "user-plus",
        label: this.state.authed ? "Open Tabs" : "Register"
      }
    };

    const { allOpenMerchants } = this.state;

    return this.state.loading === true && allOpenMerchants.length === 0 ? (
      <h1>Loading</h1>
    ) : (
      <Router history={history}>
        <div className="fullheight">
          <AppBar
            title="Paynless"
            iconElementRight={topbarButtons}
            iconStyleRight={{
              display: "flex",
              alignItems: "center",
              marginTop: "0"
            }}
          />
          <div className="container d-flex justify-content-center mt-3">
            <div className="row">
              <Switch>
                <PrivateRoute
                  path="/"
                  exact
                  authed={this.state.authed}
                  allOpenMerchants={allOpenMerchants}
                  component={CheckIn}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/register"
                  component={Register}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact path="/open-tabs"
                  component={OpenTabs}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact path="/open-tabs/:id"
                  component={OpenTabs}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact path="/admin"
                  component={AdminHome}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact path="/admin/tabs/:tabId"
                  component={AdminSingleTab}
                />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
          <BottomNavigationBar data={tabData} />
        </div>
      </Router>
    );
  }
}
