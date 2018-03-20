import React, { Component, Fragment } from 'react';
import { db } from '../config/constants';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem';

const halfMile = 1/69/2;

const findDistance = (cord1, cord2) => {
  return Math.sqrt((cord1._lat - cord2._lat)**2 + (cord1._long - cord2._long)**2)
}

export default class CheckIn extends Component {
  constructor() {
    super()
    this.state = {
      checkedInWithMerchant: false,
      openMerchants: [],
      selectedMerchant: '',
      user: '',
      useLocation: false,
      userCoords: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setcurrentPosition = this.setcurrentPosition.bind(this);
    this.findNearbyRestaurants = this.findNearbyRestaurants.bind(this);
  }

  handleChange(event, idx, val) {
    const selectedMerchant = val;
    this.setState({ selectedMerchant })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ checkedInWithMerchant: true })
  }

  setcurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(location => {
      const userCoords = {
        _lat: location.coords.latitude,
        _long: location.coords.longitude
      }
      
      // const userCoords = { //dont use actual location when you are home
      //   _lat: 40.7050604,
      //   _long: -74.00865979999999
      // }
      this.setState({ userCoords, useLocation: true })
      this.findNearbyRestaurants();
    },
      err => console.log(err)
    )
  }

  async findNearbyRestaurants() {
    let openMerchants = [];
    const { userCoords } = this.state;
    const collection = await db.collection("Merchants").get();
    collection.forEach(doc => openMerchants.push(doc.data()));
    openMerchants = openMerchants.filter(venue => {
      return findDistance(userCoords, venue.location) < halfMile;
    });
    this.setState({ openMerchants })
  }
 

  render() {
    let { openMerchants, selectedMerchant } = this.state;
    return (
      <Fragment>
      {
        !this.state.useLocation &&
        <FlatButton onClick={this.setcurrentPosition}>
          Find Restaurants Nearby
        </FlatButton>
      }
      {
        this.state.useLocation &&
        (openMerchants.length > 0 
          ?  <Fragment>
              <FlatButton onClick={this.handleSubmit}>
                {
                  selectedMerchant 
                  ? `Check in with ${selectedMerchant}` 
                  : 'Select a Merchant' 
                }
              </FlatButton>
              
              <DropDownMenu value={this.state.selectedMerchant} onChange={this.handleChange} openImmediately={true}>
                { 
                  openMerchants.map(venue => (
                    <MenuItem value={venue.name} key={venue.name}>
                      {venue.name}
                    </MenuItem>
                  ))
                }
              </DropDownMenu>
            </Fragment>
          : <h3>No Restaurants Nearby</h3>
        )
      }
      </Fragment>
    );
  }
}
