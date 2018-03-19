import React, { Component } from 'react';
import { db } from '../../config/constants';

export default class Dashboard extends Component {
  state = {
    openTabs: []
  }

  componentDidMount(){
    db.collection("Tabs").get()
    .then(snapshot => snapshot.forEach(doc => console.log('data: ', doc.data())))
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
  //});
  }

  render() {
    return (
      <div>
        PLACEHOLDER FOR THE OPEN TAB COMPONENT
      </div>
    );
  }
}
