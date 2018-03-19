import React, { Component, Fragment } from 'react';
import { db, firebaseAuth } from '../config/constants';

const halfMile = 1/69/2;

const findDistance = (cord1, cord2) => {
  return Math.sqrt((cord1._lat-cord2._lat)**2 + (cord1._long-cord2._long)**2)
}

export default class CheckIn extends Component {
  constructor() {
    super()
    this.state = {
      checkedIn: false,
      openMerchants: [],
      selectedMerchant: '',
      user: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  
  async componentDidMount() {
    let currentPos = {};    
    await window.navigator.geolocation.getCurrentPosition(location => {
      currentPos._lat = location.coords.latitude;
      currentPos._long = location.coords.longitude;
    },
      err => console.log(err)
    )
  
    let openMerchants = [];
    const collection = await db.collection("Merchants").get();
    collection.forEach(doc => openMerchants.push(doc.data()));
    openMerchants = openMerchants.filter(venue => {
      return findDistance(currentPos, venue.location) < halfMile;
    })
    this.setState({ openMerchants })
  }

  
  handleChange(event) {
    const selectedMerchant = event.target.value;
    this.setState({ selectedMerchant })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ checkedIn: true })
  }

 
  render() {
    let { openMerchants } = this.state; 
    return (
      <Fragment>
      {
        openMerchants.length > 0 &&
        <Fragment>
          <select onChange={this.handleChange}>
            <option value="Select">Select A Merchant</option>
            { 
              openMerchants.map(venue => (
                <option value={venue.name} key={venue.name}>
                  {venue.name}
                </option>
              ))
            }
          </select>
          <button onClick={this.handleSubmit}>
            Check in with {this.state.selectedMerchant}
          </button>
        </Fragment>
      }
      </Fragment>
    );
  }
}