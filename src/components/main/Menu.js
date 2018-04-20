import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Drawer, MenuItem, Divider, List, ListItem } from "material-ui";
import { UserAvatar } from "../admin";

const Menu = props => {
  const { openMenu, handleClose, userObj } = props;
  const userName = !userObj ? "Anonymous" : userObj.firstName;
  const isAdmin = !userObj ? false : userObj.isAdmin;
  return (
    <Fragment>
      <Drawer docked={false} open={openMenu} onRequestChange={handleClose}>
        <List>
          <ListItem>
            <div className="menuHeader">
              {userObj && (
                <UserAvatar
                  imgUrl={userObj.photoUrl}
                  userName={`${userObj.firstName} ${userObj.lastName}`}
                  size={45}
                />
              )}
              <div className="menuName">{userName}</div>
            </div>
          </ListItem>
          <Divider />
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
        {isAdmin && (
          <Link to="/admin">
            <MenuItem onClick={handleClose}>Admin Panel</MenuItem>
          </Link>
        )}
      </Drawer>
    </Fragment>
  );
};

export default Menu;
