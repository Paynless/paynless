import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationItem,
  Paper
} from "material-ui";
import { grey500 } from "material-ui/styles/colors";
import FontAwesome from "react-fontawesome";
import { TabData } from "./index";

class BottomNavigationBar extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index, path) => {
    this.setState({ selectedIndex: index });
    this.props.history.push(path);
  };

  render() {
    const { selectedIndex } = this.state;
    const { userObj } = this.props;

    const data = TabData(userObj);

    const navIcon1 = (
      <FontAwesome
        name={data[0].icon}
        style={{
          color: selectedIndex === 0 ? "#0a2009" : grey500
        }}
      />
    );
    const navIcon2 = (
      <FontAwesome
        name={data[1].icon}
        style={{
          color: selectedIndex === 1 ? "#0a2009" : grey500
        }}
      />
    );

    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={selectedIndex}>
          <BottomNavigationItem
            label={data[0].label}
            icon={navIcon1}
            onClick={ _=> this.select(0, data[0].path)}
          />
          <BottomNavigationItem
            label={data[1].label}
            icon={navIcon2}
            onClick={ _=> this.select(1, data[1].path)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default withRouter(BottomNavigationBar);
