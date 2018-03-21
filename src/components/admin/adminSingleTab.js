import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db, firebaseAuth } from '../../config';
import { withAuth } from 'fireview';
import { Tab } from '../customer';
import AdminTab from './adminTab';
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
    const {user} = props.withAuth;
    if(!user) return;
    if(this.removeListenerTabs) this.removeListenerTabs();

    const  { merchantId } = await db.collection("users").where("uid", "==", user.uid).get()
    .then(snapshot => {
      return snapshot.docs;
    })
    .then(docs => docs[0].data())

    const users = await db.collection("users").get()
    .then(snapshot => {
      return snapshot.docs;
    })
    .then(docs => docs.map(doc => doc.data()))

    this.removeListenerTabs = db.collection("Tabs").where("merchantId", "==", merchantId).where("open", "==", true)
    .onSnapshot((snapshot) => {
      let tabDoc = snapshot.docs.filter(doc => doc.id === props.match.params.tabId)[0]
      console.log('tab: ', tabDoc.data());
      let tab = tabDoc.data()
      let user = users.filter(user => user.uid === tab.uid)[0]
      this.setState({selectedTab: Object.assign({}, tab, {user: user}), isLoaded: true})
    });


  }

  async fetchMenuItems(props){
    const {user} = props.withAuth;
    if(!user) return;

    const  { merchantId } = await db.collection("users").where("uid", "==", user.uid).get()
    .then(snapshot => {
      return snapshot.docs;
    })
    .then(docs => docs[0].data())

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
    console.log('items: ', currentTab.items)
    if(currentTab.items.filter(item => item.name === name).length){
      let index = currentTab.items.findIndex(item => item.name === name)
      console.log('index: ', index);
      currentTab.items[index].quantity++;
    } else {
      console.log('don\'t have it');
      currentTab.items.push({name: name, price: price, quantity: 1});
    }
    console.log('currentTab', currentTab)

    db.collection("Tabs").doc(tabId)
    .set(currentTab)
  }

  render() {
    console.log('state: ', this.state);
    if(!this.state.isLoaded){
      return (
      <div>
      <CircularProgress size={80} thickness={10} />
      </div>)
    }
    return (
      <div className="adminSingleTab">
        <Tab
          merchantName={this.state.selectedTab.user.email}
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
