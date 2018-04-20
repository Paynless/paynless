import React, { Component } from "react";
import { Router } from "react-router-dom";
import { Routes, Menu, TopBar, BottomNavigationBar, history } from "../index";

export default class App extends Component {
  state = {
    openMenu: false
  };

  toggleMenu = _ => this.setState({ openMenu: !this.state.openMenu });

  handleClose = _ => this.setState({ openMenu: false });

  render() {
    const { allOpenMerchants, userObj } = this.props;

    return (
      <Router history={history}>
        <div className="fullheight">
          <div>
            <TopBar history={history} toggleMenu={this.toggleMenu} userObj={userObj} />
            <Menu
              history={history}
              toggleMenu={this.toggleMenu}
              openMenu={this.state.openMenu}
              handleClose={this.handleClose}
              userObj={userObj}
            />
          </div>
          <div className="container d-flex justify-content-center mt-3 scrollable">
            <div className="row">
              <Routes allOpenMerchants={allOpenMerchants} userObj={userObj}/>
            </div>
          </div>
          <BottomNavigationBar userObj={userObj} />
        </div>
      </Router>
    );
  }
}
