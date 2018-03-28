import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { List, ListItem } from "material-ui";
import { Favorite } from "./index";

class Profile extends Component {
  render() {
    const { allOpenMerchants, userObj } = this.props;

    let favoriteMerchants = allOpenMerchants.filter(merchant => {
      return userObj.favorites[merchant.id];
    });

    return (
      <div className="profile">
        <img height="128px" width="128px" src={userObj.photoUrl} alt="user" />
        <h5>{userObj.firstName}</h5>
        <h5>
          <FontAwesome name={"home"} /> From the best city ever
        </h5>
        <h5>JOINED MARCH 2018</h5>
        <h6>- Current Favorites -</h6>
        {userObj.favorites ? (
          <List>
            {favoriteMerchants.map(merchant => (
              <div key={merchant.id} className="checkinItem">
                <div
                  className="checkinName"
                  onClick={_ => this.props.loadTab(null, merchant)}
                >
                  <ListItem primaryText={merchant.name} />
                </div>
                <Favorite
                  isFavorite={userObj.favorites[merchant.id]}
                  merchantId={merchant.id}
                  toggle={this.toggleFavorite}
                />
              </div>
            ))}
          </List>
        ) : null}
      </div>
    );
  }
}

export default Profile;
