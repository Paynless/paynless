import React, { Component } from "react";
import { db } from "../../config";
import { withAuth } from "fireview";
import { Favorite } from "./index";
import { List, ListItem, TextField } from "material-ui";
import { escapeRegExp } from 'lodash';

class SelectMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoaded: false,
    };
  }

  updateSearch = event => {
    // prevents re-renders from crashing due to expected regex statement
    // i.e in search box: '\' or other regex chars need to be closed \ \ to be valid
    const escapedRegexValue = escapeRegExp(event.target.value);
    // disables special chars in search field
    const cleanString = escapedRegexValue.replace(/[\\|&;$%@"<>()+,*]/g, '');
    this.setState({ search: cleanString });
  }

  toggleFavorite = merchantId => {
    const { userObj } = this.props
    const currFavs = Object.assign({}, userObj.favorites);
    if (currFavs[merchantId]) {
      currFavs[merchantId] = false;
    } else {
      currFavs[merchantId] = true;
    }
    db
      .collection("Users")
      .doc(userObj.uid)
      .update({
        favorites: currFavs
      })
      .catch(err => console.error(err));
  };

  render() {
    const { openMerchants, userObj } = this.props;
    
    let favoriteMerchants = openMerchants.filter(merchant => {
      return userObj.favorites[merchant.id]
    });
    let foundMerchants = openMerchants.filter(merchant =>
      merchant.name.match(RegExp(this.state.search, "i"))
    );
    let displayMerchants = this.state.search.length
      ? foundMerchants
      : favoriteMerchants;
    return (
      <div className="selectMerchant">
        <TextField
          id="text-field-default"
          hintText="Find a spot!"
          value={this.state.search}
          onChange={this.updateSearch}
        />
        <List>
          {displayMerchants.map(merchant => (
            <div
              key={merchant.id}
              className="checkinItem"
            >
              <div className="checkinName" onClick={_ => this.props.loadTab(null, merchant)}>
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
      </div>
    );
  }
}

export default withAuth(SelectMerchant);
