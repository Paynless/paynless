import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { RaisedButton,
  FlatButton,
  DropDownMenu,
  MenuItem,
  CircularProgress,
  Dialog
} from "material-ui";
import {
  getCurrentPosition,
  findNearbyMerchants,
  findOrCreateUserOpenTab,
} from "../../helpers/";
import { SelectMerchant } from "./index";
import { db } from "../../config";

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
      isLoadingUserLocation: false,
      userHasPayment: false,
      dialogOpen: false,
    };
  }

  async componentDidMount() {
    const {userObj} = this.props

    this.removeUserListener = db
      .collection("Users")
      .doc(userObj.uid)
      .collection('stripe_source')
      .doc('tokens')
      .onSnapshot(snapshot => {
        this.setState({ userHasPayment: !!snapshot.exists });
      });
  }

  componentWillUnmount() {
    this.removeUserListener();
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
    const { userHasPayment } = this.state;
    if (userHasPayment) {
      findOrCreateUserOpenTab(userObj, merchant);
      this.props.history.push(`/open-tabs`);
    } else {
      this.setState({dialogOpen: true})
    }
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

  closeDialog = _ => this.setState({ dialogOpen: false })

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

    const addPaymentBtn = <Link to="/payment-details">
    <FlatButton>Add Payment Method</FlatButton>
    </Link>
    return (
      <Fragment>
        <Dialog
          title="Add Payment"
          actions={addPaymentBtn}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.closeDialog}
        >
          Tabs can only be created once a payment method has been entered. Please enter payment method
        </Dialog>
        {!useLocation && (
          <div className="checkIn">
            <SelectMerchant
              userObj={this.props.userObj}
              openMerchants={allOpenMerchants}
              loadTab={this.loadTab}
            />
            <div />
            <div className="findNearMe">
              <RaisedButton
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
                label={checkInText}
                primary={true}
                onClick={event => this.loadTab(event, selectedMerchant)}
                disabled={!isSelected}
              />
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
