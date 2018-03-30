import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { FlatButton, CircularProgress, Dialog, Toggle } from "material-ui";
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
      useLocation: false,
      isLoadingUserLocation: false,
      userCoords: {},
      nearbyMerchants: []
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

  loadTab = (event, merchant) => {
    event && event.preventDefault();
    const { userObj } = this.props;

    const { userHasPayment } = this.state;
    if (userHasPayment) {
      findOrCreateUserOpenTab(userObj, merchant);
      this.props.history.push(`/open-tabs`);
    } else {
      this.setState({ dialogOpen: true });
    }
  };

  locationToggle = _ => {
    const { useLocation } = this.state;
    if (!useLocation) {
      this.setState(
        { 
          useLocation: true, 
          isLoadingUserLocation: true
        }
      ) 
    } else {
      this.setState({ useLocation: false}) 
    }
  }

  async componentWillUpdate(_, nextState) {
    if (nextState.useLocation && nextState.isLoadingUserLocation) {
      try {
        let { userCoords: prevCoords, nearbyMerchants } = nextState;
        let nextCoords = await getCurrentPosition();

        if (
          Object.values(prevCoords).length ||
          nextCoords._lat !== prevCoords._lat ||
          nextCoords._long !== prevCoords._long
        ) {
          let allOpenMerchants = this.props.allOpenMerchants.slice();
          nearbyMerchants = await findNearbyMerchants(
            nextCoords,
            allOpenMerchants,
            halfMile
          );
        }

        this.setState({
          isLoadingUserLocation: false,
          nearbyMerchants,
          userCoords: nextCoords ? nextCoords : prevCoords
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  closeDialog = _ => this.setState({ dialogOpen: false });

  render() {
    const {
      useLocation,
      isLoadingUserLocation,
      nearbyMerchants
    } = this.state;
    const { allOpenMerchants } = this.props;

    const merchantList = useLocation
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
            onClick={this.locationToggle}
            thumbSwitchedStyle={{ backgroundColor: "#7CB342" }}
          />
          {isLoadingUserLocation && (
            <div>
              <CircularProgress size={50} thickness={6} />
            </div>
          )}
          <SelectMerchant
            isLoadingUserLocation={isLoadingUserLocation}
            userObj={this.props.userObj}
            openMerchants={merchantList}
            loadTab={this.loadTab}
            useLocation={useLocation}
          />
        </div>
      </Fragment>
    );
  }
}
