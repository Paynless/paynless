import React, { Component } from "react";
import { Route, Router, Redirect, Switch } from "react-router-dom";
import {
  CheckIn,
  OpenTabs,
  BottomNavigationBar,
  SplashScreen,
  CustomerInfo,
  Menu
} from "./customer";
import { Login, Register } from "./auth";
import { logout } from "../helpers";
import { firebaseAuth } from "../config";
import AppBar from "material-ui/AppBar";
import FlatButton from "material-ui/FlatButton";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import Avatar from "material-ui/Avatar";
import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500
} from "material-ui/styles/colors";
import FontIcon from "material-ui/FontIcon";
import Divider from "material-ui/Divider";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import history from "./history";
import { fetchAllMerchants } from "../helpers";
import { AdminHome, AdminSingleTab } from "./admin";

function PrivateRoute({
  component: Component,
  authed,
  allOpenMerchants,
  ...rest
}) {
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
    allOpenMerchants: [],
    openMenu: false
  };
  async componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState(_ => ({
          authed: true,
          loading: false
        }));
      } else {
        this.setState(_ => ({
          authed: false,
          loading: false
        }));
      }
    });
    const allOpenMerchants = await fetchAllMerchants();
    this.setState(_ => ({
      allOpenMerchants
    }));
  }
  componentWillUnmount() {
    this.removeListener();
  }

  toggleMenu = _ => this.setState(_ => ({ openMenu: !this.state.openMenu }));

  render() {
    console.log(this)
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
      <SplashScreen />
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
            style={{
              height: "64px",
              flexShrink: 0
            }}
            onLeftIconButtonTouchTap={this.toggleMenu}
          />
          <Drawer
            docked={false}
            open={this.state.openMenu}
            onRequestChange={this.toggleMenu}
          >
            <List>
              <ListItem>
                <Avatar
                  color={blue300}
                  backgroundColor={indigo900}
                  style={style}
                >
                  U
                </Avatar>
                User Name
              </ListItem>
            </List>

            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={_=> this.props.history.push('/payment-details')}>Payment</MenuItem>
            <MenuItem>Favorites</MenuItem>
            <MenuItem onClick={_=> this.props.history.push('/open-tabs')}>Open Tabs</MenuItem>
            <MenuItem>Tab History</MenuItem>
            <Divider />
            <MenuItem>Settings</MenuItem>
          </Drawer>
          <div className="container d-flex justify-content-center mt-3 scrollable">
            <div className="row">
              <Switch>
                <PrivateRoute
                  path="/"
                  exact
                  authed={this.state.authed}
                  allOpenMerchants={allOpenMerchants}
                  component={CheckIn}
                />
                <PrivateRoute
                  path="/payment-details"
                  exact
                  authed={this.state.authed}
                  component={CustomerInfo}
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
                  exact
                  path="/open-tabs"
                  component={OpenTabs}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact
                  path="/open-tabs/:id"
                  component={OpenTabs}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact
                  path="/admin"
                  component={AdminHome}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  exact
                  path="/admin/tabs/:tabId"
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

const style = { margin: 5 };
