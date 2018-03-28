import React, { Component, Fragment } from 'react';
import { db } from '../../config';
import Tab from './Tab';
import CircularProgress from 'material-ui/CircularProgress';

export default class OpenTabs extends Component {
  state = {
    openTabs: [],
    isLoaded: false,
  }

  componentDidMount(){
    const {userObj} = this.props

    this.removeListenerTabs = db.collection("Tabs")
      .where("uid", "==", userObj.uid)
      .where("open", "==", true)
      .onSnapshot( snapshot => {
        const openTabs = snapshot.docs.map(doc => doc.data())
      this.setState({openTabs, isLoaded: true})
      })
  }

  componentWillUnmount() {
    this.removeListenerTabs();
  }

  render() {
    const { isLoaded, openTabs } = this.state;

    if(!isLoaded){
      return (
      <Fragment>
      <CircularProgress size={80} thickness={10} />
      </Fragment>)
    }

    const noTabsText = 'Go outside and enjoy a nice meal. We\'ll help make it painless.';

    return (
      <Fragment>
        {this.state.openTabs.length ?
          (<div>
            {openTabs.map((tab, idx)=> (
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
          ) : ( <p className="noTabsText">{noTabsText}</p>)
        }
      </Fragment>
    );
  }
}
