import React, { Component } from 'react';
import { db } from '../../config';
import { withAuth } from 'fireview';
import Tab from './Tab';
import CircularProgress from 'material-ui/CircularProgress';
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
    db.collection("users").where("uid", "==", 1)//user.uid
    .get()
    .then(user => console.log('empty user', user.docs))
    //.then(user => this.setState({user: user.docs[0].data(), isLoaded: true}))
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
    //let favoriteMerchants = this.props.openMerchants.filter(merchant => this.state.user.favorites[merchant.id])
    //console.log('favorites: ', favoriteMerchants);
    return (
      <div>
        <TextField
          id="text-field-default"
          hintText="Find a spot!"
          value={this.state.search}
          onChange={(event) => this.setState({search: event.target.value})}
        />
      </div>
    );
  }
}

export default withAuth(SelectMerchant);
