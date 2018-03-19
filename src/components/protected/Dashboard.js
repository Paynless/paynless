import React, { Component } from 'react';
import { db, firebaseAuth } from '../../config/constants';

export default class Dashboard extends Component {
  state = {
    openTabs: [],
    isLoaded: false
  }

  async componentDidMount(){
    let userId;
    this.removeListener = await firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        userId = user.uid
      } else {
      }
    });
    console.log('Current User Id', userId);
    db.collection("Tabs").where("uid", "==", userId).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });


    // db.collection("Tabs").onSnapshot(function(snapshot) {
    //   snapshot.docChanges.forEach(function(change) {
    //       if (change.type === "added") {
    //           console.log("New city: ", change.doc.data());
    //       }
    //       if (change.type === "modified") {
    //           console.log("Modified city: ", change.doc.data());
    //       }
    //       if (change.type === "removed") {
    //           console.log("Removed city: ", change.doc.data());
    //       }
    //   });
    // });
  }
  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return (
      <div>
        PLACEHOLDER FOR THE OPEN TAB COMPONENT
      </div>
    );
  }
}
