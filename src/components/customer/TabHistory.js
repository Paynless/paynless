import React, { Component, Fragment } from 'react';
import { db } from '../../config';
import Tab from './Tab';
import CircularProgress from 'material-ui/CircularProgress';

export default class TabHistory extends Component {
  state = {
    closedTabs: [],
    isLoaded: false,
  }

  componentDidMount(){
    const {userObj} = this.props

    this.removeListenerTabs = db.collection("Tabs")
      .where("uid", "==", userObj.uid)
      .where("open", "==", false)
      .onSnapshot( snapshot => {
        const closedTabs = snapshot.docs.map(doc => doc.data())
      this.setState({closedTabs, isLoaded: true})
      })
  }

  componentWillUnmount() {
    this.removeListenerTabs();
  }

  render() {
    const { isLoaded, closedTabs } = this.state;

    if(!isLoaded){
      return (
      <Fragment>
      <CircularProgress size={80} thickness={10} />
      </Fragment>)
    }

    const noHistoryText = 'Go outside and enjoy a nice meal. We\'ll help make it painless.';

    return (
      <Fragment>
        {this.state.closedTabs.length ?
          (<div>
            {closedTabs.map((tab, idx)=> (
              <div key={idx}>
                <Tab
                  userObj={this.props.userObj}
                  merchantName={tab.merchantName}
                  tabId={tab.id}
                  items={tab.items}
                />
              </div>
            ))}
            </div>
          ) : ( <h3>{noHistoryText}</h3>)
        }
      </Fragment>
    );
  }
}
