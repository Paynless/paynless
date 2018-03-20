
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {cyan500, grey500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FontAwesome from 'react-fontawesome';


class BottomNavigationBar extends Component {
  state = {
    selectedIndex: 0,
  };

  componentDidMount(){
    if(this.props.location.pathname === this.props.data[0].path){
      this.setState({selectedIndex: 0})
    } else if (this.props.location.pathname === this.props.data[1].path){
      this.setState({selectedIndex: 1})
    }
  }

  select = (index) => {
    this.setState({selectedIndex: index})
    this.props.history.push(this.props.data[index].path)
  };

  render() {
    const navIcon1 = <FontAwesome name={this.props.data[0].icon} style={{ color: this.state.selectedIndex === 0 ? cyan500 : grey500
    }} />
    const navIcon2 = <FontAwesome name={this.props.data[1].icon} style={{ color: this.state.selectedIndex === 1 ? cyan500 : grey500
    }} />
    
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label={this.props.data[0].label}
            icon={navIcon1}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label={this.props.data[1].label}
            icon={navIcon2}
            onClick={() => this.select(1)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default withRouter(BottomNavigationBar);
