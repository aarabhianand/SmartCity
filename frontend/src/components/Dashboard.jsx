import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';

const announcements = [
  "🚨 New park inaugurated! 🚨",
  "⚠️ Road closures on Main St. 🚧",
  "🎉 Community event this Saturday! 🎉"
];

const Dashboard = () => {
  const [airQuality, setAirQuality] = useState(0);
  const [airQualityColor, setAirQualityColor] = useState('#4CAF50');
  const [averageAQI, setAverageAQI] = useState(120); // Dynamic AQI state
  const [predictedTraffic, setPredictedTraffic] = useState("Loading...");

  useEffect(() => {
    const randomAQI = Math.floor(Math.random() * 301);
    setAirQuality(randomAQI);

    // Update color based on AQI value
    if (randomAQI < 100) {
      setAirQualityColor('#4CAF50'); // Good (Green)
    } else if (randomAQI < 200) {
      setAirQualityColor('#FFC107'); // Moderate (Yellow)
    } else {
      setAirQualityColor('#FF5722'); // Unhealthy (Red)
    }

    // Optionally simulate setting an average AQI dynamically
    const randomAvgAQI = Math.floor(Math.random() * 150) + 100;
    setAverageAQI(randomAvgAQI);

    // Simulating traffic prediction
    setTimeout(() => {
      const trafficPredictions = [
        "Low traffic expected for the next 24 hours",
        "Moderate traffic expected in the next 2 hours",
        "High traffic expected around 5 PM"
      ];
      const randomPrediction = trafficPredictions[Math.floor(Math.random() * trafficPredictions.length)];
      setPredictedTraffic(randomPrediction);
    }, 1000); // Simulate a delay in fetching traffic data
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Smart City Dashboard</h1>

      <div className="section governor-name">
        <h2>Governor</h2>
        <p>Mitchell Calloway</p>
      </div>

      <div className="section announcements">
        <h2>Announcements</h2>
        <div className="marquee">
          {announcements.map((announcement, index) => (
            <span key={index} className="announcement">
              {announcement}
            </span>
          ))}
        </div>
      </div>

      <div className="section average-aqi">
        <h2>Average Air Quality (Past Week)</h2>
        <p>{averageAQI}</p>
      </div>

      
    </div>
  );
};

export default Dashboard;
