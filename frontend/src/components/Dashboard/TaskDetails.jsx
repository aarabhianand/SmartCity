import React from 'react';

const TaskDetails = ({ currentTask, handleTaskCompletion }) => {
 if (!currentTask) return null;

 return (
  <div className="task-details">
   <h3>{currentTask.name}</h3>
   <p>Points: {currentTask.points}</p>
   <p>Ammo: {currentTask.ammo}</p>
   <p>Treasure: {currentTask.treasure}</p>
   <button onClick={() => handleTaskCompletion(currentTask)}>Complete Task</button>
  </div>
 );
};

export default TaskDetails;