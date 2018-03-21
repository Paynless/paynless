import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import currencyFormatter from 'currency-formatter';
import Receipt from './TabItems';

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
  let total = currencyFormatter.format(totalCents / 100, { code: 'USD' });

  //style settings
  let shouldExpand = props.expanded ? false : true;
  if(props.size) styles.card.width = props.size;

  return (
  <Card style={styles.card}>
    <CardHeader
      title={props.merchantName}
      subtitle={total}
      actAsExpander={shouldExpand}
      showExpandableButton={shouldExpand}
    />
    <CardActions>
      <FlatButton label="Close Out" />
    </CardActions>
    <CardText expandable={shouldExpand}>
      <Receipt items={props.items} />
    </CardText>
  </Card>
)};

export default Tab;
