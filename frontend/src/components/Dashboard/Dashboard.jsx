import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import MapGrid from './CityMap';
import TaskDetails from './TaskDetails';
import UserPoints from './UserPoints';
import Leaderboard from './Leaderboard';

const Dashboard = () => {
 const [tasks, setTasks] = useState([
  { id: 1, name: 'Fix Streetlight', points: 10, ammo: 2, treasure: 1 },
  { id: 2, name: 'Repair Road', points: 15, ammo: 3, treasure: 2 },
  { id: 3, name: 'Clean Park', points: 20, ammo: 4, treasure: 3 },
  { id: 4, name: 'Build Playground', points: 25, ammo: 5, treasure: 4 },
  { id: 5, name: 'Fix Water Pipe', points: 30, ammo: 6, treasure: 5 },
 ]);
 
 const [leaderboard, setLeaderboard] = useState([
  { username: 'User1', points: 30 },
  { username: 'User2', points: 50 },
  { username: 'User3', points: 70 },
  { username: 'User4', points: 90 },
  { username: 'User5', points: 40 },
 ]);

 useEffect(() => {
    // Add a class to the body when the component is mounted
    document.body.classList.add('infra-background');

    // Clean up by removing the class on unmount
    return () => {
        document.body.classList.remove('infra-background');
    };
}, []);
 
 const [currentTask, setCurrentTask] = useState(null);
 const [userPoints, setUserPoints] = useState(0);
 const [completedLevels, setCompletedLevels] = useState([]);

 const handleTaskCompletion = (task) => {
  setUserPoints(prevPoints => prevPoints + task.points);
  setCompletedLevels(prevCompletedLevels => [...prevCompletedLevels, task.id]);

  const updatedLeaderboard = [...leaderboard];
  const userIndex = updatedLeaderboard.findIndex(user => user.username === 'User1');
  
  // Update leaderboard points and sort it
  if (userIndex !== -1) {
   updatedLeaderboard[userIndex].points += task.points;
   updatedLeaderboard.sort((a, b) => b.points - a.points);
   setLeaderboard(updatedLeaderboard);
  }

  alert(`Task completed: ${task.name}! You've earned ${task.points} points!`);
 };

 const handleLevelClick = (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  if (completedLevels.includes(taskId - 1) || taskId === 1) {
   if (!completedLevels.includes(taskId)) {
    setCurrentTask(task);
   } else {
    alert('Task already completed!');
   }
  } else {
   alert('Complete the previous task to unlock this level!');
  }
 };

 return (
  <div className="dashboard">
   <h1>Smart City Dashboard</h1>
   
   <MapGrid
    handleLevelClick={handleLevelClick}
    completedLevels={completedLevels}
   />

   <TaskDetails currentTask={currentTask} handleTaskCompletion={handleTaskCompletion} />
   <UserPoints userPoints={userPoints} />
   <Leaderboard leaderboard={leaderboard} />
   
   {completedLevels.length === tasks.length && <div className="completion-message">TASKS COMPLETED</div>}
  </div>
 );
};

export default Dashboard;