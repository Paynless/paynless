import React, { Component } from 'react';
import { db } from '../../config';
import { withAuth } from 'fireview';
import { Tab } from '../customer';
import MenuItem from './menuItem';
import CircularProgress from 'material-ui/CircularProgress';

class AdminSingleTab extends Component {
  state = {
    selectedTab: {},
    menuItems: [],
    isLoaded: false
  }

  componentDidMount(){
    this.listen(this.props);
  }

  componentWillReceiveProps(props){
    this.listen(props);
    this.fetchMenuItems(props);
  }

  componentWillUnmount() {
    this.removeListenerTabs && this.removeListenerTabs();
  }

  async listen(props){
    if(this.removeListenerTabs) this.removeListenerTabs();

    this.removeListenerTabs = db.collection("Tabs").doc(props.match.params.tabId)
    .onSnapshot((snapshot) => {
      console.log('snapshot', snapshot);
      if(snapshot.exists){
        let tab = snapshot.data();
        this.setState({selectedTab: tab, isLoaded: true})
      }
    });
  }

  async fetchMenuItems(props){
    const {user} = props.withAuth;
    if(!user) return;

    const  { merchantId } = props.userObj

    const { menu } = await db.collection("Merchants").doc(merchantId).get()
    .then(snapshot => {
      if(snapshot.exists){
        return snapshot.data()
      }
    })
    this.setState({menuItems: menu});
  }

  handleAdd = (name, price) => {
    let currentTab = this.state.selectedTab;
    let tabId = this.props.match.params.tabId;
    if(currentTab.items.filter(item => item.name === name).length){
      let index = currentTab.items.findIndex(item => item.name === name)
      currentTab.items[index].quantity++;
    } else {
      currentTab.items.push({name: name, price: price, quantity: 1});
    }

    db.collection("Tabs").doc(tabId)
    .set(currentTab)
  }

  render() {
    if(!this.state.isLoaded){
      return (
      <div>
      <CircularProgress size={80} thickness={10} />
      </div>)
    }
    return (
      <div className="adminSingleTab">
        <Tab
          merchantName={this.state.selectedTab.userName}
          items={this.state.selectedTab.items}
          expanded={true}
          size={400}
        />
        <div className="adminMenuItems">
          {this.state.menuItems.map((item, idx ) => (
            <MenuItem
              key={idx}
              name={item.name}
              price={item.price}
              onClick={(name, price) => this.handleAdd(name, price)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withAuth(AdminSingleTab);
