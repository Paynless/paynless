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
import { withAuth } from "fireview";
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
      tip: 0.18
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = event => {
    event.preventDefault();
    this.setState({ open: false });

    const { user } = this.props.withAuth;

    try {
      console.log("Updating db for charge...");
      db
        .collection("Users")
        .where("uid", "==", user.uid)
        .get()
        .then(doc => {
          let doc_id = doc.docs[0].id;
          let paymentId = uuidv4();

          db
            .collection("User")
            .doc(`${doc_id}/payments/${paymentId}`)
            .set({ price: 0.50 }, { merge: true });
        });
    } catch (err) {
      console.log(err);
    }
  };


  handleSlider = (event, value) => {
    this.setState({ tip: Math.round(value * 100) / 100 });
  };

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton label="Pay" primary={true} onClick={this.handleClose} />
    ];

    return (
      <div>
        <FlatButton label="Close Out" onClick={this.handleOpen} />
        <Dialog
          title={`Checkout from ${this.props.merchantName}`}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={customContentStyle}
        >
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
                  {currencyFormatter.format(this.props.total / 100, {
                    code: "USD"
                  })}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Tip:</TableRowColumn>
                <TableRowColumn>
                  {currencyFormatter.format(
                    this.props.total * this.state.tip / 100,
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

export default injectStripe(withAuth(Checkout));
