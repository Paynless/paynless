import React, { Fragment } from "react";
import { Typeahead } from "react-typeahead";
import LinearProgress from "material-ui/LinearProgress";
import FlatButton from "material-ui/FlatButton";

class TypeaheadSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMerchant: '',
      checkedInWithMerchant: false
    };
  }

  handleSubmit = () => {
    this.setState({ checkedInWithMerchant: true });
    console.log(`checked in at ${this.state.selectedMerchant}`);
  };

  componentDidMount() {
    const { fetchAllOpenRestaurants } = this.props;
    fetchAllOpenRestaurants();
  }

  allLoaded = _ => {
    const { selectedMerchant, checkedInWithMerchant } = this.state;
    const { allOpenMerchants, loadingAllMerchants } = this.props;
    if (loadingAllMerchants) {
      return (
        <div>
          <LinearProgress mode="indeterminate" />
          <Typeahead
            disabled={loadingAllMerchants}
            placeholder="Search all..."
            options={allOpenMerchants}
            maxVisible={5}
            onOptionSelected={selectedMerchant =>
              this.setState({ selectedMerchant })
            }
          />
        </div>
      );
    } else {
      return (
        <div>
          <FlatButton
            label="Check In"
            primary={true}
            fullWidth={true}
            onClick={this.handleSubmit}
            disabled={!Boolean(selectedMerchant)}
          />
          <Typeahead
            disabled={loadingAllMerchants}
            placeholder="Search all..."
            options={allOpenMerchants}
            maxVisible={5}
            onOptionSelected={selectedMerchant =>
              this.setState({ selectedMerchant })
            }
          />
        </div>
      );
    }
  };

  render() {
    return <Fragment>{this.allLoaded()}</Fragment>;
  }
}

export default TypeaheadSearch;

