import React from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import currencyFormatter from 'currency-formatter';

const styles = {
  card: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  }
};

const MenuItem = (props) => {
  return (
  <Card style={styles.card} onClick={() => props.onClick(props.name, props.price)}>
    <CardHeader
      title={props.name}
      subtitle={currencyFormatter.format(props.price / 100, { code: 'USD' })}
    />
    <CardActions>
      <FlatButton label="Add to Tab" />
    </CardActions>
  </Card>
)};

export default MenuItem;
