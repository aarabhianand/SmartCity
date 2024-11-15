// frontend/src/About.jsx
import React from "react";
import "./styles/About.css";

function About() {
  return (
    <div className="about-page">
      <h1>CITI-FIX-IT-FELIX</h1>
      <p>
      CITI-FIX-IT-FELIX involves the use of advanced technology, data
        analytics, and IoT to enhance urban life quality. It optimizes resources,
        improves infrastructure, and provides a sustainable environment.
      </p>

      <div className="stats">
        <div className="stat">
          <h2>75%</h2>
          <p>Reduction in Traffic</p>
        </div>
        <div className="stat">
          <h2>85%</h2>
          <p>Improvement in Waste Management</p>
        </div>
        <div className="stat">
          <h2>60%</h2>
          <p>Increase in Public Safety</p>
        </div>
      </div>

      <div className="description">
        <p>
          By leveraging IoT sensors, AI analytics, and real-time data, smart
          cities can address challenges like traffic congestion, energy waste, and
          public safety concerns more efficiently than traditional methods.
        </p>
      </div>
    </div>
  );
}

export default About;