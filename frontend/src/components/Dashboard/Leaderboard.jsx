import React from 'react';

const Leaderboard = ({ leaderboard }) => {
 return (
  <div className="leaderboard-container">
   <h2>Leaderboard</h2>
   <ul>
    {leaderboard.map((user, index) => (
     <li key={index}>
      {user.username} - {user.points} points
     </li>
    ))}
   </ul>
  </div>
 );
};

export default Leaderboard;