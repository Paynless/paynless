import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { List, ListItem } from "material-ui";
import { Favorite } from "./index";
import { UserAvatar } from "../admin";

class Profile extends Component {
  render() {
    const { allOpenMerchants, userObj } = this.props;

    let favoriteMerchants = allOpenMerchants.filter(merchant => {
      return userObj.favorites[merchant.id];
    });

    return (
      <div className="profile">
        <div className="profileHeader">
          <UserAvatar imgUrl={userObj.photoUrl} userName={`${userObj.firstName} ${userObj.lastName}`} size={128}/>
          <div className="profileInfo">
            <h5>{userObj.firstName}</h5>
            <h5>
              <FontAwesome name={"home"} />From the best city ever
            </h5>
            <h5>JOINED MARCH 2018</h5>
          </div>
        </div>
        <div className="profileFavorites">
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
                    toggle={() => null}
                  />
                </div>
              ))}
            </List>
          ) : null}
          </div>
      </div>
    );
  }
}

export default Profile;
