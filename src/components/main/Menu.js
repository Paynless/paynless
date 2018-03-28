import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Drawer, MenuItem, Avatar, Divider, List, ListItem
} from "material-ui";
import { green900, lightGreen600 } from "material-ui/styles/colors";
import { withAuth } from "fireview";

class Menu extends React.Component {

  render() {
    const { openMenu, handleClose, userObj } = this.props;
    const userName = !userObj ? "Anonymous" : userObj.firstName
    const isAdmin = !userObj ? false : userObj.isAdmin
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
              {userName.slice(0, 1)}
              </Avatar>
              {userName}
            </ListItem>
          </List>
          <Link to="/user-profile">
            <MenuItem onClick={handleClose}>Profile</MenuItem>
          </Link>
          <Link to="/payment-details">
            <MenuItem onClick={handleClose}>Payment</MenuItem>
          </Link>
          <Link to="/">
            <MenuItem onClick={handleClose}>Create New Tab</MenuItem>
          </Link>
          <Link to="/open-tabs">
            <MenuItem onClick={handleClose}>Open Tabs</MenuItem>
          </Link>
          <Link to="/tab-history">
            <MenuItem onClick={handleClose}>Tab History</MenuItem>
          </Link>
          <Divider />
          {/*<Link to="/settings">
            <MenuItem onClick={handleClose}>Settings</MenuItem>
    </Link>*/}
          <Link to="/addVenue">
            <MenuItem onClick={handleClose}>Add Business</MenuItem>
          </Link>
          {isAdmin && <Link to="/admin">
            <MenuItem onClick={handleClose}>Admin Panel</MenuItem>
          </Link> }
        </Drawer>
      </Fragment>
    );
  }
}

export default withAuth(Menu)
