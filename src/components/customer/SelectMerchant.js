import React, { Component } from 'react';
import { db } from '../../config';
import { withAuth } from 'fireview';
import Favorite from './Favorite'
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';

class SelectMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isLoaded: false,
      user: {}
    };
  }

  componentDidMount(){
    this.listenUser(this.props);
  }

  componentWillReceiveProps(props){
    this.listenUser(props);
  }

  componentWillUnmount() {
    this.removeListener && this.removeListener();
  }

  listenUser(props){
    const {user} = props.withAuth;
    if(!user) return;
    if(this.removeListener) this.removeListener();

    this.removeListener = db.collection("users").where("uid", "==", user.uid)
    .onSnapshot(userDocs => {
      const user = Object.assign({}, userDocs.docs[0].data(), {docId: userDocs.docs[0].id})
      this.setState({user, isLoaded: true})
    })
  }

  toggleFavorite = (merchantId) => {
    const currFavs = Object.assign({}, this.state.user.favorites)
    if(currFavs[merchantId]){
      currFavs[merchantId] = false;
    } else {
      currFavs[merchantId] = true;
    }
    db.collection("users").doc(this.state.user.docId)
    .update({
      "favorites": currFavs
    })
    .then(item => console.log('what we get back from update', item))
    .catch(err => console.error(err))
  }

  render() {
    console.log('state in new component: ', this.state)
    console.log('merchants in new component: ', this.props);
    if(!this.state.isLoaded){
      return (
      <div>
      <CircularProgress size={80} thickness={10} />
      </div>)
    }
    let favoriteMerchants = this.props.openMerchants.filter(merchant => this.state.user.favorites[merchant.id])
    let foundMerchants = this.props.openMerchants.filter(merchant => merchant.name.match(RegExp(this.state.search, 'i')))
    console.log('favorites: ', favoriteMerchants);
    console.log('searched for: ', foundMerchants);
    let displayMerchants = this.state.search.length ? foundMerchants : favoriteMerchants;
    return (
      <div>
        <TextField
          id="text-field-default"
          hintText="Find a spot!"
          value={this.state.search}
          onChange={(event) => this.setState({search: event.target.value})}
        />
        <List>
          {displayMerchants.map(merchant => (
          <div key={merchant.id} className="checkinItem">
            <div className="checkinName">
              <ListItem
                primaryText={merchant.name}
              />
            </div>
            <Favorite
              isFavorite={this.state.user.favorites[merchant.id]}
              merchantId={merchant.id}
              toggle={this.toggleFavorite}
            />
          </div>
          )
          )}
        </List>
      </div>
    );
  }
}

export default withAuth(SelectMerchant);
