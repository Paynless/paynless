import React from 'react';

const UserAvatar = (props) => {
  let initials = props.userName.split(' ').map(name => name.slice(0,1)).join('');
  return (
    <div className="profileImgOutline" style={{height: props.size, width: props.size}}>
      {props.imgUrl ?
      (<img src={props.imgUrl} style={{height: props.size, width: props.size}} className="profileImage" alt="user-profile" />) :
      (<h6 className="initials" style={{fontSize: props.size * 0.4, top: props.size * 0.057}}>{initials}</h6>)}

    </div>
)};

export default UserAvatar;
