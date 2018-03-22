import React from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import currencyFormatter from 'currency-formatter';

export default function Receipt(props){
  let tableData = props.items
  return (
    <div>
      <Table
        fixedHeader={false}
        style={{ width: "auto", tableLayout: "auto" }}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn >Food/Drink</TableHeaderColumn>
            <TableHeaderColumn>Quantity</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={false}
          showRowHover={false}
          stripedRows={false}
        >
          {tableData.map( (item, index) => (
            <TableRow key={index}>
              <TableRowColumn>{item.name}</TableRowColumn>
              <TableRowColumn>{item.quantity}</TableRowColumn>
              <TableRowColumn>{currencyFormatter.format((item.price * item.quantity) / 100, { code: 'USD' })}</TableRowColumn>
            </TableRow>
            ))}
        </TableBody>
        <TableFooter
          adjustForCheckbox={false}
        >
        </TableFooter>
      </Table>
    </div>
  );
}
