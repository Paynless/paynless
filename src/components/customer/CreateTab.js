import React, { Component, Fragment } from "react";
import { FlatButton,
  DropDownMenu,
  MenuItem,
  CircularProgress
} from "material-ui";
import {
  getCurrentPosition,
  findNearbyMerchants,
  findOrCreateUserOpenTab
} from "../../helpers/";
import { SelectMerchant } from "./index";

const halfMile = 1 / 69 / 2;

export default class CreateTab extends Component {
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
    this.setState({ selectedMerchant });
  };

  loadTab = (event, merchant) => {
    event && event.preventDefault();
    const { userObj } = this.props;
    if (!userObj) return;

    findOrCreateUserOpenTab(userObj, merchant);
    this.props.history.push(`/open-tabs`);
  };

  narrowMerchantsUsingLocation = async _ => {
    try {
      let allOpenMerchants = this.props.allOpenMerchants.slice();
      this.setState({
        isLoadingUserLocation: true
      });

      const userCoords = await getCurrentPosition();
      const nearbyMerchants = await findNearbyMerchants(
        userCoords,
        allOpenMerchants,
        halfMile
      );

      this.setState({
        userCoords,
        useLocation: true,
        isLoadingUserLocation: false,
        locationSearchConducted: nearbyMerchants.length > 0,
        nearbyMerchants
      });
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
    const checkInText = selectedMerchant.name
      ? `Create a tab with ${selectedMerchant.name}`
      : "Select a Merchant";

    return (
      <Fragment>
        {!useLocation && (
          <div className="checkIn">
            <SelectMerchant
              userObj={this.props.userObj}
              openMerchants={allOpenMerchants}
              loadTab={this.loadTab}
            />
            <div />
            <div className="findNearMe">
              <FlatButton
                label="Find Near Me"
                onClick={this.narrowMerchantsUsingLocation}
                primary={true}
              />
            </div>
          </div>
        )}
        {isLoadingUserLocation && <CircularProgress size={60} thickness={7} />}
        {locationSearchConducted &&
          nearbyMerchants.length < 1 && <h3>No Restaurants Nearby</h3>}
        {locationSearchConducted &&
          nearbyMerchants.length > 0 && (
            <Fragment>
              <FlatButton
                primary={true}
                fullWidth={true}
                onClick={event => this.loadTab(event, selectedMerchant)}
                disabled={!isSelected}
              >
                {checkInText}
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
