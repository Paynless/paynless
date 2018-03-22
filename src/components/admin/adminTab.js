import React from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import currencyFormatter from 'currency-formatter';

const styles = {
  card: {
    width: 400,
    overflow: 'hidden',
    margin: '20px auto 0',
  }
};

const AdminTab = (props) => {
  let totalCents = 0;
  props.items.forEach(item => {
    totalCents += (item.price * item.quantity);
  })
  let total = currencyFormatter.format(totalCents / 100, { code: 'USD' });
  return (
  <Card style={styles.card}>
    <CardHeader
      title={props.userName}
      subtitle={total}
      actAsExpander={false}
      showExpandableButton={false}
    />
  </Card>
)};

export default AdminTab;
