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
    this.awaitUser(this.props);
  }

  componentWillReceiveProps(props){
    this.awaitUser(props);
  }


  awaitUser(props){
    const {user} = props.withAuth;
    if(!user) return;
    db.collection("users").where("uid", "==", user.uid)
    .get()
    .then(user => this.setState({user: user.docs[0].data(), isLoaded: true}))
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
          <div className="checkinItem">
            <div className="checkinName">
              <ListItem
                key={merchant.id}
                primaryText={merchant.name}
              />
            </div>
            <Favorite isFavorite={this.state.user.favorites[merchant.id]} />
          </div>
          )
          )}
        </List>
      </div>
    );
  }
}

export default withAuth(SelectMerchant);
