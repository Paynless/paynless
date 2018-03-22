import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class CreditCardDropdown extends Component {
  state = {
    value: 1,
  };

  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <div>
        <SelectField
          floatingLabelText="Select a Credit Card"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <MenuItem value={1} primaryText="Visa Ending in 1111" />
          <MenuItem value={2} primaryText="American Express Ending in 4343" />
          <MenuItem value={3} primaryText="Mastercard Ending in 1999" />
        </SelectField>
      </div>
    )
  }
}
