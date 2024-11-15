import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles/ViewInspection.css'; // Import the CSS file

function ViewInspections() {
  const [assignedInspections, setAssignedInspections] = useState([]);
  const [completedInspections, setCompletedInspections] = useState([]);
  const [inspectorId, setInspectorId] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [findings, setFindings] = useState({});
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    const storedInspectorId = localStorage.getItem("inspector_id");
    setInspectorId(storedInspectorId);
    console.log("Inspector ID loaded from local storage:", storedInspectorId);

    if (storedInspectorId) {
      fetchInspections(storedInspectorId);
    }
  }, []);

  const fetchInspections = async (id) => {
    try {
      console.log("Fetching assigned inspections for inspector ID:", id);
      const response = await axios.get(`http://localhost:5001/api/assigned-inspections?inspector_id=${id}`);
      const data = response.data;
      console.log("Assigned Inspections Response Data:", data);

      if (data && data.length > 0) {
        setAssignedInspections(data);
        console.log("Assigned inspections set in state:", data);

        const completedInspectionsResponse = await axios.get("http://localhost:5001/api/completed-inspections");
        setCompletedInspections(completedInspectionsResponse.data);
        console.log("Completed Inspections Response Data:", completedInspectionsResponse.data);
      } else {
        console.log("No assigned inspections found.");
      }
    } catch (error) {
      console.error("Error fetching inspection data:", error);
    }
  };

  const handleInspectNow = (inspectionId) => {
    setSelectedInspection(inspectionId);
  };

  const handleSubmitInspection = async (inspectionId, infrastructureId) => {
    if (!inspectionId || !recommendations[inspectionId] || !findings[inspectionId]) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      console.log("Submitting inspection with:", {
        inspector_id: inspectorId,
        inspection_id: inspectionId,
        infrastructure_id: infrastructureId,
        recommendation: recommendations[inspectionId],
        finding: findings[inspectionId],
      });

      await axios.post("http://localhost:5001/api/complete-inspection", {
        inspector_id: inspectorId,
        inspection_id: inspectionId,
        infrastructure_id: infrastructureId,
        recommendation: recommendations[inspectionId],
        finding: findings[inspectionId],
      });

      // Update assigned and completed inspections after submission
      setAssignedInspections((prev) =>
        prev.filter((inspection) => inspection.inspection_id !== inspectionId)
      );
      setCompletedInspections((prev) => [
        ...prev,
        assignedInspections.find((inspection) => inspection.inspection_id === inspectionId),
      ]);

      setSelectedInspection(null);
      const newRecommendations = { ...recommendations };
      const newFindings = { ...findings };
      delete newRecommendations[inspectionId];
      delete newFindings[inspectionId];
      setRecommendations(newRecommendations);
      setFindings(newFindings);
      console.log("Inspection submitted and state updated.");
    } catch (error) {
      console.error("Error submitting inspection:", error);
    }
  };

  useEffect(() => {
    // Add a class to the body when the component is mounted
    document.body.classList.add('infra-background');

    // Clean up by removing the class on unmount
    return () => {
        document.body.classList.remove('infra-background');
    };
}, []);

  return (
    <div className="view-inspections-container">
      <h2>View Inspections</h2>

      <div className="inspection-section">
        {/* Assigned Inspections Section */}
        <div>
          <h3>Assigned Inspections</h3>
          {assignedInspections.length === 0 ? (
            <p className="no-inspections">No assigned inspections</p>
          ) : (
            assignedInspections.map((inspection) => (
              <div
                key={inspection.inspection_id}
                className="inspection-card"
              >
                <p className="inspection-item"><strong>Infrastructure:</strong> {inspection.display}</p>
                <p className="inspection-item"><strong>Inspection Date:</strong> {inspection.inspection_date}</p>
                {selectedInspection === inspection.inspection_id ? (
                  <div>
                    <input
                      type="text"
                      value={recommendations[inspection.inspection_id] || ""}
                      onChange={(e) =>
                        setRecommendations({
                          ...recommendations,
                          [inspection.inspection_id]: e.target.value,
                        })
                      }
                      placeholder="Enter recommendations"
                    />
                    <input
                      type="text"
                      value={findings[inspection.inspection_id] || ""}
                      onChange={(e) =>
                        setFindings({
                          ...findings,
                          [inspection.inspection_id]: e.target.value,
                        })
                      }
                      placeholder="Enter findings"
                    />
                    <button
                      onClick={() =>
                        handleSubmitInspection(
                          inspection.inspection_id,
                          inspection.infrastructure_id
                        )
                      }
                    >
                      Submit Inspection
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleInspectNow(inspection.inspection_id)}>
                    Inspect Now
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Completed Inspections Section */}
        <div>
          <h3>Completed Inspections</h3>
          {completedInspections.length === 0 ? (
            <p className="no-inspections">No completed inspections</p>
          ) : (
            completedInspections.map((inspection) => (
              <div
                key={inspection.inspection_id}
                className="inspection-card"
              >
                <p className="inspection-item"><strong>Infrastructure:</strong> {inspection.display}</p>
                <p className="inspection-item"><strong>Inspection Date:</strong> {inspection.inspection_date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewInspections;
