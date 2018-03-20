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
        } else {
        }
      });

      //this is here because if the state is empty, the listener never returns a callback
      await db.collection("Tabs").where("uid", "==", userId)
      .get()
      .then(docs => {
        if(!docs.exists){
          this.setState(() => ({isLoaded: true}));
        }
      })
      .catch(err => console.error(err));

      this.removeListenerTabs = await db.collection("Tabs").where("uid", "==", userId).where("open", "==", true)
      .onSnapshot((snapshot) => {
        snapshot.docChanges.forEach((change) => {
            let changedTab = {
              id: change.doc.id,
              data: change.doc.data()
            }
            if (change.type === "added") {
              this.setState(prevState => ({openTabs: [...prevState.openTabs, changedTab], isLoaded: true, hasTabs: true}))
            }
            if (change.type === "modified") {
              this.setState(prevState => ({openTabs: [...prevState.openTabs.filter(tab => tab.id !== changedTab.id), changedTab], isLoaded: true, hasTabs: true}))
            }
            if (change.type === "removed") {
              this.setState(prevState => ({openTabs: prevState.openTabs.filter(tab => tab.id !== changedTab.id), isLoaded: true, hasTabs: prevState.openTabs.filter(tab => tab.id !== changedTab.id).length > 0}))
            }
          });
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
          {this.state.openTabs.map(tab => (
            <div key={tab.id}>
              <Tab
                merchantName={tab.data.merchantName}
                items={tab.data.items}
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
