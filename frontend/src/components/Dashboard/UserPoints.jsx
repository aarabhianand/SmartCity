import React from 'react';

const UserPoints = ({ userPoints }) => {
 return (
  <div className="user-points">
   <p>Your Points: {userPoints}</p>
  </div>
 );
};

export default UserPoints;