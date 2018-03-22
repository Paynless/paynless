import React, { Component, Fragment } from "react";
import FlatButton from "material-ui/FlatButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import CircularProgress from "material-ui/CircularProgress";
import { withAuth } from "fireview";
import { Typeahead } from "react-typeahead";
import {
  getCurrentPosition,
  findNearbyMerchants,
  findOrCreateUserOpenTabs
} from "../../helpers/";

const halfMile = 1 / 69 / 2;

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nearbyMerchants: [],
      locationSearchConducted: false,
      selectedMerchant: {},
      useLocation: false,
      userCoords: {},
      isLoadingUserLocation: false
    };
  }

  updateSelectedMerchant = (event, idx, name) => {
    const { allOpenMerchants } = this.props;
    console.log("update", name);
    const selectedMerchant = allOpenMerchants.find(merchant => {
      return merchant.name === name;
    });
    this.setState(_ => ({ selectedMerchant }));
  };

  loadTab = async event => {
    try {
      event.preventDefault();
      const { user } = this.props.withAuth;
      if (!user) return;

      const { selectedMerchant } = this.state;

      const tab = await findOrCreateUserOpenTabs(user.uid, selectedMerchant);
      console.log("tab", tab.data());
      this.props.history.push(`/open-tabs/${selectedMerchant.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  narrowMerchantsUsingLocation = async _ => {
    try {
      let allOpenMerchants = this.props.allOpenMerchants.slice();

      this.setState(_ => ({
        isLoadingUserLocation: true
      }));

      const userCoords = await getCurrentPosition();

      const nearbyMerchants = await findNearbyMerchants(
        userCoords,
        allOpenMerchants,
        halfMile
      );
      // console.log("nearby", nearbyMerchants);
      this.setState(_ => ({
        userCoords,
        useLocation: true,
        isLoadingUserLocation: false,
        locationSearchConducted: nearbyMerchants.length > 0,
        nearbyMerchants
      }));
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const {
      useLocation,
      isLoadingUserLocation,
      locationSearchConducted,
      nearbyMerchants,
      selectedMerchant
    } = this.state;
    const { allOpenMerchants } = this.props;
    const merchantNames =
      locationSearchConducted
        ? nearbyMerchants.map(venue => venue.name)
        : allOpenMerchants.map(venue => venue.name);
    console.log("names", merchantNames);
    const isSelected = selectedMerchant.hasOwnProperty("name");
    return (
      <Fragment>
        <FlatButton
          primary={true}
          fullWidth={true}
          onClick={this.loadTab}
          disabled={!isSelected}
        >
          {selectedMerchant.name
            ? `Check in with ${selectedMerchant.name}`
            : "Select a Merchant"}
        </FlatButton>
        {!useLocation && (
          <div>
            <Typeahead
              placeholder="Search all..."
              options={merchantNames}
              maxVisible={5}
              onOptionSelected={val =>
                this.updateSelectedMerchant(null, null, val)
              }
            />
            <h4>--OR--</h4>
            <FlatButton
              label="Find Near Me"
              onClick={this.narrowMerchantsUsingLocation}
              primary={true}
            />
          </div>
        )}
        {isLoadingUserLocation && 
          <CircularProgress size={60} thickness={7} />}
        {locationSearchConducted &&
          nearbyMerchants.length < 1 && <h3>No Restaurants Nearby</h3>}
        {locationSearchConducted &&
          nearbyMerchants.length > 0 && (
            <Fragment>
              <DropDownMenu
                value={selectedMerchant.name}
                onChange={this.updateSelectedMerchant}
                openImmediately={true}
              >
                {merchantNames.forEach(name => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ))}
              </DropDownMenu>
            </Fragment>
          )}
      </Fragment>
    );
  }
}

export default withAuth(CheckIn);
