import React, { Component, Fragment } from 'react';
import CheckIn from './CheckIn'

export default class Home extends Component {
  render() {
    return (
      <Fragment>Home. Not Protected. Anyone can see this.
        <CheckIn />
      </Fragment>
    );
  }
}
