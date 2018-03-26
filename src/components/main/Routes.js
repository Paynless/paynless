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
  AddVenue,
} from "../index";
import { withAuth } from "fireview";

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

class Routes extends Component {
  render() {
    const { user } = this.props.withAuth || null;
    const { allOpenMerchants } = this.props;
    return (
      <Switch>
        <PrivateRoute
          path="/"
          exact
          authed={!!user}
          allOpenMerchants={allOpenMerchants}
          component={CheckIn}
        />
        <PrivateRoute
          path="/payment-details"
          exact
          authed={!!user}
          component={CustomerInfo}
        />
        <PublicRoute authed={!!user} path="/login" component={Login} />
        <PublicRoute authed={!!user} path="/register" component={Register} />
        <PrivateRoute
          authed={!!user}
          exact
          path="/open-tabs"
          component={OpenTabs}
        />
        <PrivateRoute
          authed={!!user}
          exact
          path="/open-tabs/:id"
          component={OpenTabs}
        />
        <PrivateRoute
          authed={!!user}
          exact
          path="/admin"
          component={AdminHome}
        />
        <PrivateRoute
          authed={!!user}
          exact
          path="/admin/tabs/:tabId"
          component={AdminSingleTab}
        />
        <PrivateRoute
          authed={!!user}
          exact
          path="/addVenue"
          component={AddVenue}
        />
        <Route render={_ => <h3>No Match</h3>} />
      </Switch>
    );
  }
}

export default withAuth(Routes);
