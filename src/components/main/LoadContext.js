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

  componentDidUpdate(prevProps, prevState) {
    const { ready: thisAuthReady } = this.props.withAuth;
    const { allOpenMerchants: thisMerchants } = this.state;

    if (thisAuthReady && thisMerchants.length > 0) {
      const { ready: prevAuthReady } = prevProps.withAuth;
      const { allOpenMerchants: prevMerchants } = prevState;

      if (!prevAuthReady || prevMerchants.length === 0) {
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