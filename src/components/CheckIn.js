import React, { Component, Fragment } from 'react';
import dummyVenues from './dummyVenues';
export default class CheckIn extends Component {
  constructor() {
    super()
    this.state = {
      checkedIn: false,
      merchant: '',
      user: ''
    };
  }

  render() {
    let venues = dummyVenues.results.map(venue => ({
      merchant: venue.name,
      address: venue.vicinity,
      types: venue.types || [],
      open: venue.opening_hours 
        ? venue.opening_hours.open_now 
        : false,
    }));
    const openRestaurants = venues.filter(venue => {
      return venue.types.includes("restaurant") && venue.open
    })

    return (
      <Fragment>
      
        <select>
          <option value="Select">Select A Merchant</option>
          { 
            openRestaurants.map(venue => (
              <option value={venue.merchant} key={venue.merchant}>
                {venue.merchant}
              </option>
            ))
          }
        </select>
      </Fragment>);
  }
}