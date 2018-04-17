import React, { Component } from "react";
import { App, SplashScreen } from "../index";
import { fetchAllMerchants } from "../../helpers";
import { withAuth } from "fireview";
import { db } from "../../config";

class LoadContext extends Component {
  state = {
    allOpenMerchants: [],
    userObj: null,
    isLoading: true
  };

  async componentDidMount() {
    try {
      const allOpenMerchants = await fetchAllMerchants();
      this.setState({ allOpenMerchants});
    } catch (err) {
      console.log(err);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: nextUser } = nextProps.withAuth
    const { user: prevUser } = this.props.withAuth
    
    if (nextUser === prevUser) return;

    this.removeUserListener && this.removeUserListener()

    if (!nextUser) return this.setState({ userObj: null });
    
    this.removeUserListener = db
      .collection("Users")
      .doc(nextUser.uid)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const userObj = snapshot.data();
          this.setState({ userObj });
        }
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.withAuth.ready && nextState.allOpenMerchants.length > 0) {
      if (
        !this.props.withAuth.ready ||
        this.state.allOpenMerchants.length === 0
      ) {
        this.setState({ isLoading: false });
      }
    }
  }

  componentWillUnmount() {
    this.removeUserListener();
  }

  render() {
    const { allOpenMerchants, userObj, isLoading } = this.state;

    return isLoading 
      ? <SplashScreen /> 
      : <App allOpenMerchants={allOpenMerchants} userObj={userObj} />;
  }
}

export default withAuth(LoadContext);