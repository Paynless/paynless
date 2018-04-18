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
    console.log(this.props.withAuth.user)
    try {
      const allOpenMerchants = await fetchAllMerchants();
      this.setState({ allOpenMerchants});
    } catch (err) {
      console.log(err);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { user: nextUser } = nextProps.withAuth
  //   const { user: prevUser } = this.props.withAuth
    
  //   if (nextUser === prevUser) return;

  //   this.removeUserListener && this.removeUserListener()

  //   if (!nextUser) return this.setState({ userObj: null });
    
  //   this.removeUserListener = db
  //     .collection("Users")
  //     .doc(nextUser.uid)
  //     .onSnapshot(snapshot => {
  //       if (snapshot.exists) {
  //         const userObj = snapshot.data();
  //         this.setState({ userObj });
  //       }
  //     });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { ready: thisAuthReady } = this.props.withAuth;
    const { allOpenMerchants: thisMerchants } = this.state;
    const { allOpenMerchants: prevMerchants } = prevState;
    console.log('component updated')
    if (thisAuthReady) {
      const { user: thisUser } = this.props.withAuth
      const { user: prevUser } = prevProps.withAuth
      console.log('merchants loaded?', !!thisMerchants.length)
      if (thisMerchants.length > 0 && !prevMerchants.length) {
        this.setState({ isLoading: false });
      }
      console.log('auth ready, userObj has changed?', thisUser !== prevUser)
      if (thisUser === prevUser) return;
      
      console.log('userlistener exists?', !!this.removeUserListener)
      this.removeUserListener && this.removeUserListener()
      if (!thisUser) return this.setState({ userObj: null });

      console.log('adding listener')
      this.removeUserListener = db
        .collection("Users")
        .doc(thisUser.uid)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            console.log('user exists')
            const userObj = snapshot.data();
            this.setState({ userObj });
          }
        });
      console.log('listener added?', this.state.userObj)
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