import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../config';
import { AdminTab } from './index';
import CircularProgress from 'material-ui/CircularProgress';

class AdminHome extends Component {
  state = {
    openTabs: [],
    isLoaded: false
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

  async listen(props){
    try {
      if(this.removeListenerTabs) this.removeListenerTabs();

      const  { merchantId } = props.userObj

      this.removeListenerTabs = db.collection("Tabs").where("merchantId", "==", merchantId).where("open", "==", true)
      .onSnapshot((snapshot) => {
        let tabData = snapshot.docs.map(doc => doc.data())
        this.setState({openTabs: tabData, isLoaded: true})
      });
    } catch (err) {
      console.error(err);
    }
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
        (<div className="adminTabs">
          {this.state.openTabs.map((tab)=> (
            <Link
              key={tab.id}
              to={`/admin/tabs/${tab.id}`}
            >
              <AdminTab
                userName={tab.userName}
                items={tab.items}
                value={tab.id}
                userObj={this.props.userObj}
                tab={tab}
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

export default AdminHome;
