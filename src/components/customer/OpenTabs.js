import React, { Component } from 'react';
import { db, firebaseAuth } from '../../config';
import Tab from './Tab';

export default class OpenTabs extends Component {
  state = {
    openTabs: [],
    isLoaded: false
  }

  async componentDidMount(){
    const merchantId = this.props.match.params.id
    let userId;
    //wrap with auth
    this.removeListenerUser = await firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        userId = user.uid
      } else {
      }
    });

    this.removeListenerTabs = await db.collection("Tabs")
    .where("uid", "==", userId)
    .onSnapshot( snapshot => {
      snapshot.docChanges.forEach( change => {
          let changedTab = {
            id: change.doc.id,
            data: change.doc.data()
          }
          if (change.type === "added") {
            this.setState(prevState => ({openTabs: [...prevState.openTabs, changedTab]}))
          }
          if (change.type === "modified") {
            this.setState(prevState => ({openTabs: [...prevState.openTabs.filter(tab => tab.id !== changedTab.id), changedTab]}))
          }
          if (change.type === "removed") {
            this.setState(prevState => ({openTabs: prevState.openTabs.filter(tab => tab.id !== changedTab.id)}))
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
    return (
      <div>
        {this.state.openTabs.map(tab => (
          <div key={tab.id}>
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
