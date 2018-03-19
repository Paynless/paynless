import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import currencyFormatter from 'currency-formatter';
import Receipt from './tabItems';

const styles = {
  card: {
    width: '95vw',
    overflow: 'hidden',
    margin: '20px auto 0',
  }
};

const Tab = (props) => {
  let totalCents = 0;
  props.items.forEach(item => {
    totalCents += (item.price * item.quantity);
  })
  console.log('total cents: ', totalCents)
  let total = currencyFormatter.format(totalCents / 100, { code: 'USD' });
  return (
  <Card style={styles.card}>
    <CardHeader
      title={props.merchantName}
      subtitle={total}
      actAsExpander={true}
      showExpandableButton={true}
    />
    <CardActions>
      <FlatButton label="Close Out" />
    </CardActions>
    <CardText expandable={true}>
      <Receipt items={props.items} />
    </CardText>
  </Card>
)};

export default Tab;
