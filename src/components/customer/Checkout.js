import React, { Component } from "react";
import { Dialog, FlatButton, Slider } from "material-ui";
import CreditCardDropdown from "./CreditCardDropdown";
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import currencyFormatter from "currency-formatter";
import { injectStripe } from "react-stripe-elements";
import { db } from "../../config";
import uuidv4 from "uuid/v4";

const customContentStyle = {
  width: "95vw",
  maxWidth: "none"
};

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      paymentSubmitted: false,
      errorMessage: '',
      tip: 0.18
    };
  }

  handleOpen = () => {
    this.setState({ open: true, errorMessage: ''});
  };

  handleCloseCancel = event => {
    event.preventDefault();
    this.setState({open: false})
  }

  handleCloseNoCharges = event => {
    event.preventDefault();
    this.setState({open: false})
    db.collection("Tabs")
      .doc(this.props.tab.id)
      .set({ open: false }, { merge: true })
  }

  handleClosePay = async event => {
    event.preventDefault();
    this.setState({ paymentSubmitted: true, errorMessage: ''});
    if (this.removeListener) this.removeListener();
    try {
      const { userObj, tab } = this.props;
      let paymentId = uuidv4();
      let price = Math.round(this.props.total * (this.state.tip + 1)) / 100;

      await db.collection("Users")
        .doc(`${userObj.uid}/payments/${paymentId}`)
        .set({ price: price }, { merge: true })

      this.removeListener = db.collection("Users")
      .doc(`${userObj.uid}/payments/${paymentId}`)
      .onSnapshot(snapshot => {
        let data = snapshot.data()
        if (data.charge){
          this.setState({open: false})
          db.collection("Tabs")
          .doc(tab.tabId)
          .set({ open: false, chargeData: data.charge }, { merge: true })
        } else if (data.paymentError){
          this.setState({paymentSubmitted: false, errorMessage: data.paymentError})
        }
      })
    } catch (err) {
      console.error(err);
    }

  };

  handleSlider = (event, value) => {
    this.setState({ tip: Math.round(value * 100) / 100 });
  };

  render() {
    const { total, tab } = this.props;

    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleCloseCancel} />,
      <FlatButton label={total > 0 ? "Pay" : "Close Tab"} primary={true} onClick={total > 0 ? this.handleClosePay : this.handleCloseNoCharges} />
    ];

    const submitted = [
      <FlatButton label="Submitting Payment..." primary={true} />
    ]

    return (
      <div>
        <FlatButton label="Close Out" onClick={this.handleOpen} />
        <Dialog
          title={`Checkout from ${tab.merchantName}`}
          actions={this.state.paymentSubmitted ? submitted : actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={customContentStyle}
        >
          {this.state.errorMessage.length ? (
            <div className="ErrorMessage"> Sorry, there was a problem! {this.state.errorMessage}</div>
          ) :
          (null)}
          <Table
            fixedHeader={false}
            style={{ width: "auto", tableLayout: "auto" }}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            />
            <TableBody
              displayRowCheckbox={false}
              deselectOnClickaway={false}
              showRowHover={false}
              stripedRows={false}
            >
              <TableRow>
                <TableRowColumn>Subtotal:</TableRowColumn>
                <TableRowColumn>
                  {currencyFormatter.format(total / 100, {
                    code: "USD"
                  })}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Tip:</TableRowColumn>
                <TableRowColumn>
                  {currencyFormatter.format(
                    total * this.state.tip / 100,
                    { code: "USD" }
                  )}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  <h6>Total:</h6>
                </TableRowColumn>
                <TableRowColumn>
                  <h6>
                    {currencyFormatter.format(
                      this.props.total * (this.state.tip + 1) / 100,
                      { code: "USD" }
                    )}
                  </h6>
                </TableRowColumn>
              </TableRow>
            </TableBody>
            <TableFooter adjustForCheckbox={false} />
          </Table>
          <h4>Tip: {Math.round(this.state.tip * 100)}%</h4>
          <Slider
            min={0}
            max={0.4}
            step={0.01}
            value={this.state.tip}
            onChange={this.handleSlider}
          />
          <CreditCardDropdown />
        </Dialog>
      </div>
    );
  }
}

export default injectStripe(Checkout);
