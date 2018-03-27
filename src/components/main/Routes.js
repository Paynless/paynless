import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import {
  CheckIn,
  OpenTabs,
  CustomerInfo,
  AdminHome,
  AdminSingleTab,
  Login,
  Register,
  AddVenue
} from "../index";
import { withAuth } from "fireview";

function PrivateRoute({
  component: Component,
  authed,
  allOpenMerchants,
  userObj,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component allOpenMerchants={allOpenMerchants} userObj={userObj} {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function AdminRoute({
  component: Component,
  isAdmin,
  allOpenMerchants,
  userObj,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        isAdmin === true ? (
          <Component
            allOpenMerchants={allOpenMerchants}
            userObj={userObj}
            {...props}
          />
        ) : (
          <h1>Permission DENIED</h1>
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

class Routes extends Component {
  render() {
    const { ready } = this.props.withAuth;
    if (!ready) return null;

    const { allOpenMerchants, userObj } = this.props;

    const isAuthed = !!userObj;
    const isAdmin = !userObj ? false : userObj.isAdmin;

    return (
      <Switch>
        <PrivateRoute
          path="/"
          exact
          authed={isAuthed}
          userObj={userObj}
          allOpenMerchants={allOpenMerchants}
          component={CheckIn}
        />
        <PrivateRoute
          exact
          path="/payment-details"
          userObj={userObj}
          authed={isAuthed}
          component={CustomerInfo}
        />
        <PrivateRoute
          authed={isAuthed}
          exact
          path="/open-tabs"
          userObj={userObj}
          component={OpenTabs}
        />
        <PrivateRoute
          authed={isAuthed}
          exact
          path="/open-tabs/:id"
          userObj={userObj}
          component={OpenTabs}
        />
        <PublicRoute authed={isAuthed} path="/login" component={Login} />
        <PublicRoute authed={isAuthed} path="/register" component={Register} />
        <AdminRoute
          isAdmin={isAdmin}
          exact
          path="/admin"
          userObj={userObj}
          component={AdminHome}
        />
        <AdminRoute
          isAdmin={isAdmin}
          exact
          path="/admin/tabs/:tabId"
          userObj={userObj}
          component={AdminSingleTab}
        />
        <PrivateRoute
          authed={isAuthed}
          exact
          path="/addVenue"
          userObj={userObj}
          component={AddVenue}
        />
        <Route render={_ => <h3>No Match</h3>} />
      </Switch>
    );
  }
}

export default withAuth(Routes);
