import React, { Component } from 'react';
import { db, firebaseAuth } from '../../config/constants';
import Tab from './tab';

export default class Dashboard extends Component {
  state = {
    openTabs: [],
    isLoaded: false
  }

  async componentDidMount(){
    let userId;
    this.removeListenerUser = await firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        userId = user.uid
      } else {
      }
    });
    console.log('Current User Id', userId);

    let self = this;
    this.removeListenerTabs = await db.collection("Tabs").where("uid", "==", userId)
    .onSnapshot(function(snapshot) {
      snapshot.docChanges.forEach(function(change) {
          let changedTab = {
            id: change.doc.id,
            data: change.doc.data()
          }
          if (change.type === "added") {
            self.setState(prevState => ({openTabs: [...prevState.openTabs, changedTab]}))
          }
          if (change.type === "modified") {
            self.setState(prevState => ({openTabs: [...prevState.openTabs.filter(tab => tab.id !== changedTab.id), changedTab]}))
          }
          if (change.type === "removed") {
            self.setState(prevState => ({openTabs: prevState.openTabs.filter(tab => tab.id !== changedTab.id)}))
          }
        });
      });
      this.setState({isLoaded: true})
    }

  componentWillUnmount() {
    this.removeListenerUser();
    this.removeListenerTabs();
  }

  render() {
    console.log('state: ', this.state)
    return (
      <div>
        {this.state.openTabs.map(tab => (
          <div key={tab.id}>
            {/* <h2>{tab.data.merchantName}</h2>
            {tab.data.items.map((item, idx) => (
              <div key={idx}>
                {item.name} quant: {item.quantity} price: {item.price * item.quantity}
              </div>
            ))} */}
            <Tab
              merchantName={tab.data.merchantName}
              items={tab.data.items}
            />
          </div>

        ))}
      </div>
    );
  }
}
