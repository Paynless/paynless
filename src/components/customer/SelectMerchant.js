import React, { Component } from "react";
import { db } from "../../config";
import { withAuth } from "fireview";
import { Favorite } from "./index";
import { CircularProgress, List, ListItem, TextField } from "material-ui";
import { escapeRegExp } from 'lodash';

class SelectMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoaded: false,
      user: {}
    };
  }

  componentDidMount() {
    this.listenUser(this.props);
  }

  componentWillReceiveProps(props) {
    this.listenUser(props);
  }

  componentWillUnmount() {
    this.removeListener && this.removeListener();
  }


  listenUser(props) {
    const { user } = props.withAuth;
    if (!user) return;
    if (this.removeListener) this.removeListener();

    this.removeListener = db
      .collection("users")
      .where("uid", "==", user.uid)
      .onSnapshot(userDocs => {
        const user = Object.assign({}, userDocs.docs[0].data(), {
          docId: userDocs.docs[0].id
        });
        this.setState({ user, isLoaded: true });
      });
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
    const currFavs = Object.assign({}, this.state.user.favorites);
    if (currFavs[merchantId]) {
      currFavs[merchantId] = false;
    } else {
      currFavs[merchantId] = true;
    }
    db
      .collection("users")
      .doc(this.state.user.docId)
      .update({
        favorites: currFavs
      })
      .catch(err => console.error(err));
  };

  render() {
    const { openMerchants } = this.props;
    const { user } = this.state;
    if (!this.state.isLoaded) {
      return (
        <div>
          <CircularProgress size={80} thickness={10} />
        </div>
      );
    }
    let favoriteMerchants = openMerchants.filter(merchant => {
      return user.favorites[merchant.id]
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
                isFavorite={this.state.user.favorites[merchant.id]}
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
