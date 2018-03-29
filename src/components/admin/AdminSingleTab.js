import React, { Component, Fragment } from "react";
import { db } from "../../config";
import { Tab } from "../customer";
import { MenuItem } from "./index";
import {CircularProgress, RaisedButton} from "material-ui";

export default class AdminSingleTab extends Component {
  state = {
    selectedTab: {},
    menuItems: [],
    isLoaded: false
  };

  componentDidMount() {
    const { match } = this.props;

    this.removeListenerTabs = db
      .collection("Tabs")
      .doc(match.params.tabId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const selectedTab = snapshot.data();
          this.setState({ selectedTab, isLoaded: true });
        }
      });
    this.fetchMenuItems(this.props);
  }

  componentWillUnmount() {
    this.removeListenerTabs && this.removeListenerTabs();
  }

  async fetchMenuItems(props) {
    const { merchantId } = props.userObj;

    const { menu } = await db
      .collection("Merchants")
      .doc(merchantId)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          return snapshot.data();
        }
      });
    this.setState({ menuItems: menu });
  }

  handleAdd = (name, price) => {
    let currentTab = this.state.selectedTab;
    let tabId = this.props.match.params.tabId;
    if (currentTab.items.filter(item => item.name === name).length) {
      let index = currentTab.items.findIndex(item => item.name === name);
      currentTab.items[index].quantity++;
    } else {
      currentTab.items.push({ name: name, price: price, quantity: 1 });
    }

    db
      .collection("Tabs")
      .doc(tabId)
      .set(currentTab);
  };

  render() {
    const { isLoaded, selectedTab } = this.state;
    if (!isLoaded) {
      return (
        <div>
          <CircularProgress size={80} thickness={10} />
        </div>
      );
    } else if (!selectedTab.open) {
        return (
          <div className="verticalFlex">
            <h3>This tab has been closed</h3>
            <RaisedButton 
              label="Return to Admin Panel" 
              onClick={event => {
                event.preventDefault()
                this.props.history.push("/admin")
              }}
              secondary={true}
            />
          </div>
        )
    }
    return (
      <div className="adminSingleTab">
        <Tab
          tab={selectedTab}
          userObj={this.props.userObj}
          expanded={true}
          size={400}
        />
        <div className="adminMenuItems">
          {this.state.menuItems.map((item, idx) => (
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
