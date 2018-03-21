import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db, firebaseAuth } from '../../config';
import { withAuth } from 'fireview';
import { Tab } from '../customer';
import AdminTab from './adminTab';
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
      let tab = snapshot.docs.filter(doc => doc.id === 1)
      // tab = tab.map(tab => {
      //   let user = users.filter(user => user.uid === tab.data.uid)[0]
      //   return Object.assign({}, tab, {user: user})
      // })
      // this.setState({openTabs: tabData, isLoaded: true})
    });
  }

  async fetchMenuItems(props){
    console.log('called fetch menu items');
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

  render() {
    if(!this.state.isLoaded){
      return (
      <div>
      <CircularProgress size={80} thickness={10} />
      </div>)
    }
    console.log('singleTab props: ', this.props);
    return (
      <div>
        {this.state.openTabs.length ?
        (<div>
          {this.state.openTabs.map((tab)=> (
            <Link
              key={tab.id}
              to={`/admin/tabs/${tab.id}`}
            >
              <AdminTab
                userName={tab.user.email}
                items={tab.data.items}
                value={tab.id}
              />
            </Link>
          ))}
          </div>
        ) : (
          <div>
          No tabs found!
          </div>
        )
        }
      </div>
    );
  }
}

export default withAuth(AdminSingleTab);
