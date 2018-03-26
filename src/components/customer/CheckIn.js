import React, { Component, Fragment } from "react";
import { FlatButton, DropDownMenu, MenuItem, CircularProgress } from "material-ui";
import { withAuth } from "fireview";
import { getCurrentPosition, findNearbyMerchants, findOrCreateUserOpenTabs } from "../../helpers/";
import SelectMerchant from './SelectMerchant';

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
    const selectedMerchant = allOpenMerchants.find(merchant => {
      return merchant.name === name;
    });
    this.setState(_ => ({ selectedMerchant }));
  };

  loadTab = async (event, merchantName)=> {
    try {
      event && event.preventDefault();
      const { user } = this.props.withAuth;
      if (!user) return;

      let selectedMerchant;
      if (merchantName) {
        selectedMerchant = this.props.allOpenMerchants.find(merchant => {
          return merchant.name === merchantName;
        });
      } else {
        selectedMerchant = this.state.selectedMerchant;
      }

      await findOrCreateUserOpenTabs(user.uid, selectedMerchant);

      this.props.history.push("/open-tabs");
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
    const isSelected = selectedMerchant.hasOwnProperty("name");
    return (
      <Fragment>
      {!useLocation && (
        <div className="checkIn">
          <SelectMerchant openMerchants={allOpenMerchants} loadTab={this.loadTab}/>
          <div></div>
          <div className="findNearMe">
            <FlatButton
            label="Find Near Me"
            onClick={this.narrowMerchantsUsingLocation}
            primary={true}
            />
          </div>
        </div>
      )}
      {isLoadingUserLocation &&
        <CircularProgress size={60} thickness={7} />}
        {locationSearchConducted &&
          nearbyMerchants.length < 1 && <h3>No Restaurants Nearby</h3>}
          {locationSearchConducted &&
            nearbyMerchants.length > 0 && (
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
              <DropDownMenu
                value={selectedMerchant.name}
                onChange={this.updateSelectedMerchant}
                openImmediately={true}
              >
                {nearbyMerchants.map(venue => (
                  <MenuItem value={venue.name} key={venue.name}>
                    {venue.name}
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
