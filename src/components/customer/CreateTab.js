import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  FlatButton,
  CircularProgress,
  Dialog,
  Toggle
} from "material-ui";
import {
  getCurrentPosition,
  findNearbyMerchants,
  findOrCreateUserOpenTab
} from "../../helpers/";
import { SelectMerchant } from "./index";
import { db } from "../../config";

const halfMile = 1 / 69 / 2;

export default class CreateTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userHasPayment: false,
      dialogOpen: false,
      isLoadingUserLocation: false,
      nearbyMerchants: [],
      locationSearchConducted: false,
    };
  }

  async componentDidMount() {
    const { userObj } = this.props;

    this.removeUserListener = db
      .collection("Users")
      .doc(userObj.uid)
      .collection("stripe_source")
      .doc("tokens")
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
      this.setState({ dialogOpen: true });
    }
  };

  narrowMerchantsUsingLocation = async _ => {
    try {
      const { locationSearchConducted } = this.state;

      if (!locationSearchConducted) {
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
          isLoadingUserLocation: false,
          locationSearchConducted: true,
          nearbyMerchants
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  closeDialog = _ => this.setState({ dialogOpen: false });

  render() {
    const {
      useLocation,
      isLoadingUserLocation,
      locationSearchConducted,
      nearbyMerchants,
    } = this.state;
    const { allOpenMerchants } = this.props;

    const merchantList =
      (useLocation && locationSearchConducted)
        ? nearbyMerchants
        : allOpenMerchants;

    const addPaymentBtn = (
      <Link to="/payment-details">
        <FlatButton>Add Payment Method</FlatButton>
      </Link>
    );

    return (
      <Fragment>
        <Dialog
          title="Add Payment"
          actions={addPaymentBtn}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.closeDialog}
        >
          Tabs can only be created once a payment method has been entered.
          Please enter payment method
        </Dialog>
        <div className="checkIn">
          <Toggle
            label="Search Near My Location"
            onClick={this.narrowMerchantsUsingLocation}
            thumbSwitchedStyle={{backgroundColor: '#7CB342'}}
          />
          {isLoadingUserLocation && (
            <div>
              <CircularProgress size={50} thickness={6} />
            </div>
          )}
          <SelectMerchant
            userObj={this.props.userObj}
            openMerchants={merchantList}
            loadTab={this.loadTab}
          />
        </div>
      </Fragment>
    );
  }
}
