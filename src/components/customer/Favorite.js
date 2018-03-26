import React from 'react';
import FontAwesome from 'react-fontawesome';
import {lightGreen600
  , grey500} from 'material-ui/styles/colors';


const Favorite = (props) => {
  return (
    <div className="favoriteIcon">
      <FontAwesome name={'star'} style={{ color: props.isFavorite ? lightGreen600
 : grey500
        }}
        onClick={() => props.toggle(props.merchantId)} />
    </div>
)};

export default Favorite;
