import React, { Component, Fragment } from "react";
import { db } from "../../config/constants";
import FlatButton from "material-ui/FlatButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import CircularProgress from "material-ui/CircularProgress";
import TypeaheadSearch from "./TypeaheadSearch";

const halfMile = 1 / 69 / 2;

const findDistance = (cord1, cord2) => {
  return Math.sqrt(
    (cord1._lat - cord2._lat) ** 2 + (cord1._long - cord2._long) ** 2
  );
};

export default class CheckIn extends Component {
  constructor() {
    super();
    this.state = {
      checkedInWithMerchant: false,
      allOpenMerchants: [],
      loadingAllMerchants: true,
      openMerchants: [],
      selectedMerchant: "",
      user: "",
      useLocation: false,
      userCoords: {},
      loading: false
    };
  }

  handleChange = (event, idx, val) => {
    const selectedMerchant = val;
    this.setState({ selectedMerchant });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ checkedInWithMerchant: true });
  };

  setcurrentPosition = _ => {
    this.setState(_ => ({
      loading: true
    }));
    window.navigator.geolocation.getCurrentPosition(
      location => {
        const userCoords = {
          _lat: location.coords.latitude,
          _long: location.coords.longitude
        };

        // const userCoords = { //dont use actual location when you are home
        //   _lat: 40.7050604,
        //   _long: -74.00865979999999
        // }
        this.setState(_ => ({
          userCoords,
          useLocation: true
        }));
        this.findNearbyRestaurants();
      },
      err => {
        alert("Could not find location");
        console.log(err);
      }
    );
  };

  fetchAllOpenRestaurants = async _ => {
    try {
      let allOpenMerchants = [];
      const collection = await db.collection("Merchants").get();
      collection.forEach(doc => {
        allOpenMerchants.push(doc.data().name);
        this.setState(_ => ({ allOpenMerchants, loadingAllMerchants: false }));
      });
    } catch (err) {
      console.errror(err);
    }
  };

  findNearbyRestaurants = async _ => {
    try {
      let openMerchants = [];
      const { userCoords } = this.state;
      const collection = await db.collection("Merchants").get();
      collection.forEach(doc => openMerchants.push(doc.data()));
      openMerchants = openMerchants.filter(venue => {
        return findDistance(userCoords, venue.location) < halfMile;
      });
      this.setState(_ => ({ openMerchants, loading: false }));
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { allOpenMerchants, loadingAllMerchants } = this.state;
    let { openMerchants, selectedMerchant, loading } = this.state;
    return (
      <Fragment>
        {loading && <CircularProgress size={60} thickness={7} />}
        {!this.state.useLocation && (
          <div>
            <TypeaheadSearch
              fetchAllOpenRestaurants={this.fetchAllOpenRestaurants}
              loadingAllMerchants={loadingAllMerchants}
              allOpenMerchants={allOpenMerchants}
              onChange={this.handleChange}
              value={this.state.selectedMerchant}
            />

            <h4>--OR--</h4>
            <FlatButton
              label="Find Near Me"
              onClick={this.setcurrentPosition}
              primary={true}
            />
          </div>
        )}
        {this.state.useLocation &&
          (openMerchants.length > 0 ? (
            <Fragment>
              <FlatButton onClick={this.handleSubmit}>
                {selectedMerchant
                  ? `Check in with ${selectedMerchant}`
                  : "Select a Merchant"}
              </FlatButton>
              <DropDownMenu
                value={this.state.selectedMerchant}
                onChange={this.handleChange}
                openImmediately={true}
              >
                {openMerchants.map(venue => (
                  <MenuItem value={venue.name} key={venue.name}>
                    {venue.name}
                  </MenuItem>
                ))}
              </DropDownMenu>
            </Fragment>
          ) : (
            <h3>No Restaurants Nearby</h3>
          ))}
      </Fragment>
    );
  }
}
