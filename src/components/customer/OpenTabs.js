import React, { Component } from 'react';
import { db } from '../../config';
import { withAuth } from 'fireview';
import Tab from './Tab';
import CircularProgress from 'material-ui/CircularProgress';

class OpenTabs extends Component {
  state = {
    openTabs: [],
    isLoaded: false,
    hasTabs: false
  }

  componentDidMount(){
    this.listen(this.props);
  }

  componentWillReceiveProps(props){
    this.listen(props);
  }

  componentWillUnmount() {
    this.removeListenerTabs && this.removeListenerTabs();
  }

  listen(props){
    const {userObj} = props;

    if(!userObj) return;
    if(this.removeListenerTabs) this.removeListenerTabs();
    this.removeListenerTabs = db.collection("Tabs").where("uid", "==", userObj.uid).where("open", "==", true)
    .onSnapshot((snapshot) => {
      this.setState({openTabs: snapshot.docs.map(doc => doc.data()), isLoaded: true})
    });
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
        {this.state.openTabs.length ?
        (<div>
          {this.state.openTabs.map((tab, idx )=> (
            <div key={idx}>
              <Tab
                userObj={this.props.userObj}
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

export default OpenTabs;
