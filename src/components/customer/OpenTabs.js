import React, { Component } from 'react';
import { db, firebaseAuth } from '../../config/constants';
import Tab from './Tab';
import CircularProgress from 'material-ui/CircularProgress';

export default class Dashboard extends Component {
  state = {
    openTabs: [],
    isLoaded: false,
    hasTabs: false
  }

  async componentDidMount(){
    try {
      let userId;
      this.removeListenerUser = await firebaseAuth().onAuthStateChanged(user => {
        if (user) {
          userId = user.uid
        }
      });

      this.removeListenerTabs = await db.collection("Tabs").where("uid", "==", userId).where("open", "==", true)
      .onSnapshot((snapshot) => {
        if(snapshot.docs.length){
          let tabs = []
          snapshot.docs.forEach((doc) => tabs.push(doc.data()));
          this.setState(() => ({openTabs: tabs, isLoaded: true, hasTabs: true}))
        } else {
          this.setState(() => ({openTabs: [], isLoaded: true, hasTabs: false}));
        }
      });
    } catch (err) {
        console.error(err);
    }

  }

  componentWillUnmount() {
    this.removeListenerUser();
    this.removeListenerTabs();
  }

  render() {
    if(!this.state.isLoaded){
      return (
      <div>
      <CircularProgress size={80} thickness={10} />
      </div>)
    }
    return (
      <div>
        {this.state.hasTabs ?
        (<div>
          {this.state.openTabs.map((tab, idx )=> (
            <div key={idx}>
              <Tab
                merchantName={tab.merchantName}
                items={tab.items}
              />
            </div>
          ))}
          </div>
        ) : (
          <div>
          No tabs found, open one and start the fun!
          </div>
        )
        }
      </div>
    );
  }
}
