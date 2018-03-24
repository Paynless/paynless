import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  MenuItem,
  Avatar,
  Divider,
  List,
  ListItem
} from "material-ui";
import {
  green900,
  lightGreen600,
} from "material-ui/styles/colors";

export default class Menu extends React.Component {

  render() {
    const { user, openMenu, handleClose } = this.props;
    return (
      <Fragment>
        <Drawer
          docked={false}
          open={openMenu}
          onRequestChange={handleClose}
        >
          <List>
            <ListItem>
              <Avatar
                color={green900}
                backgroundColor={lightGreen600}
                style={{ margin: 5 }}
              >
                U
              </Avatar>
              User Name
            </ListItem>
          </List>
          <Link to="/user-profile">
            <MenuItem onClick={handleClose}>Profile</MenuItem>
          </Link>
          <Link to="/payment-details">
            <MenuItem onClick={handleClose}>Payment</MenuItem>
          </Link>
          <Link to="/favorites">
            <MenuItem onClick={handleClose}>Favorites</MenuItem>
          </Link>
          <Link to="/open-tabs">
            <MenuItem onClick={handleClose}>Open Tabs</MenuItem>
          </Link>
          <Link to="/history">
            <MenuItem onClick={handleClose}>Tab History</MenuItem>
          </Link>
          <Divider />
          <Link to="/settings">
            <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Link>
          {user && <Link to="/admin">
            <MenuItem onClick={handleClose}>Admin Panel</MenuItem>
          </Link> }
        </Drawer>
      </Fragment>
    );
  }
}
