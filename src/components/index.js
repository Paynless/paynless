import React, { Component } from 'react';
import { Route, Router, Link, Redirect, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './protected/Dashboard';
import { logout } from '../helpers/auth';
import { firebaseAuth } from '../config/constants';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import history from './history'
import LoginBottomNavigation from './Login-Register-BottomBar'

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )}
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )}
    />
  );
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  };
  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
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
        style={{ color: '#fff' }}
      />
    ) : (
      null
    );

    const topbarButtons = (
      <div>
        {authButtons}
      </div>
    );

    const tabData = {
      0: {
        path: this.state.authed ? "/" : "/login",
        icon: this.state.authed ? "plus-circle" : "sign-in",
        label: this.state.authed ? "New Tab" : "Login"
      },
      1: {
        path: this.state.authed ? "/dashboard" : "/register",
        icon: this.state.authed ? "sticky-note" : "user-plus",
        label: this.state.authed ? "Open Tabs" : "Register"
      }
    }
    return this.state.loading === true ? (
      <h1>Loading</h1>
    ) : (
      <Router history={history}>
        <div className="fullheight">
          <AppBar
            title="Paynless"
            iconElementRight={topbarButtons}
            iconStyleRight={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '0'
            }}
          />
          <div className="container d-flex justify-content-center mt-3">
            <div className="row">
              <Switch>
                <PrivateRoute
                  path="/" exact
                  component={Home}
                  authed={this.state.authed}
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
                  path="/dashboard"
                  component={Dashboard}
                />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
          <LoginBottomNavigation data={tabData}/>
        </div>
      </Router>
    );
  }
}
