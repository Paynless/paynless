import React, { Component, Fragment } from "react";
import { db } from "../../config";
import Tab from "./Tab";
import CircularProgress from "material-ui/CircularProgress";

export default class OpenTabs extends Component {
  state = {
    openTabs: [],
    isLoaded: false
  };

  componentDidMount() {
    const { userObj } = this.props;

    this.removeListenerTabs = db
      .collection("Tabs")
      .where("uid", "==", userObj.uid)
      .where("open", "==", true)
      .onSnapshot(snapshot => {
        const openTabs = snapshot.docs.map(doc => doc.data());
        this.setState({ openTabs, isLoaded: true });
      });
  }

  componentWillUnmount() {
    this.removeListenerTabs && this.removeListenerTabs();
  }

  render() {
    const { isLoaded, openTabs } = this.state;

    if (!isLoaded) {
      return (
        <Fragment>
          <CircularProgress size={80} thickness={10} />
        </Fragment>
      );
    }

    const noTabsText = "No open tabs found! Who's hungry?";

    return (
      <Fragment>
        {openTabs.length ? (
          <div>
            {openTabs.map((tab, idx) => (
              <div key={idx}>
                <Tab userObj={this.props.userObj} tab={tab} />
              </div>
            ))}
            </div>
          ) : ( <p className="noTabsText">{noTabsText}</p>)
        }
      </Fragment>
    );
  }
}
