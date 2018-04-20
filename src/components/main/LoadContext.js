import React, { Component } from "react";
import { App, SplashScreen } from "../index";
import { fetchAllMerchants } from "../../helpers";
import { withAuth } from "fireview";
import { db } from "../../config";

class LoadContext extends Component {
  state = {
    userObj: null,
    isLoading: true,
    allOpenMerchants: []
  };

  async componentDidUpdate(prevProps, prevState) {
    const { ready: thisAuthReady } = this.props.withAuth;

    if (thisAuthReady) {
      const { user: thisUser } = this.props.withAuth;
      const { user: prevUser } = prevProps.withAuth;

      if (thisUser === prevUser) return;

      this.removeUserListener && this.removeUserListener();
      if (!thisUser) return this.setState({ userObj: null });

      this.removeUserListener = db
        .collection("Users")
        .doc(thisUser.uid)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const userObj = snapshot.data();
            this.setState({ userObj });
          }
        });

      try {
        const allOpenMerchants = await fetchAllMerchants();
        this.setState({ allOpenMerchants, isLoading: false });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentWillUnmount() {
    this.removeUserListener();
  }

  render() {
    const { allOpenMerchants, userObj, isLoading } = this.state;
    const { user, ready: authIsReady } = this.props.withAuth;

    return authIsReady && (!user || !isLoading) ? (
      <App allOpenMerchants={allOpenMerchants} userObj={userObj} />
    ) : (
      <SplashScreen />
    );
  }
}

export default withAuth(LoadContext);
