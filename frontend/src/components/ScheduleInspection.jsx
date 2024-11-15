import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/ScheduleInspection.css'; // Import the CSS file for styling

function ScheduleInspection() {
  const [infrastructures, setInfrastructures] = useState([]);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfrastructures = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/infrastructuresfor");
        console.log("Data received from API:", response.data);
        if (Array.isArray(response.data)) {
          setInfrastructures(response.data);
        } else {
          setInfrastructures([]);
        }
      } catch (error) {
        console.error("Error fetching infrastructure data:", error);
      }
    };
    fetchInfrastructures();
  }, []);

  const handleSubmit = async () => {
    setErrorMessage('');
  
    const inspectorId = localStorage.getItem('inspector_id');
    if (!inspectorId) {
      setErrorMessage("Inspector not logged in");
      return;
    }
  
    if (!selectedInfrastructure || !inspectionDate) {
      setErrorMessage("Please select infrastructure and date.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/schedule-inspection", {
        infrastructure_id: selectedInfrastructure,
        inspection_date: inspectionDate,
        inspector_id: inspectorId,
      });
      
      alert("Inspection scheduled successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error scheduling inspection:", error);
      setErrorMessage(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="schedule-inspection-container">
      <h2 className="schedule-inspection-title">Schedule Inspection</h2>
      {errorMessage && <h3 className="error-message">{errorMessage}</h3>}
      
      <div className="form-group">
        <label htmlFor="infrastructure-select" className="form-label">Select Infrastructure</label>
        <select
          id="infrastructure-select"
          value={selectedInfrastructure}
          onChange={(e) => setSelectedInfrastructure(e.target.value)}
          className="form-select"
        >
          <option value="">Select Infrastructure</option>
          {infrastructures.length > 0 ? (
            infrastructures.map((infra) => (
              <option key={infra.infrastructure_id} value={infra.infrastructure_id}>
                {infra.display}
              </option>
            ))
          ) : (
            <option value="" disabled>Loading infrastructures...</option>
          )}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="inspection-date" className="form-label">Inspection Date</label>
        <input
          id="inspection-date"
          type="date"
          value={inspectionDate}
          onChange={(e) => setInspectionDate(e.target.value)}
          className="form-input"
        />
      </div>
      
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
}

export default ScheduleInspection;
