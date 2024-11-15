import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssueReportPage = () => {
    const [reason, setReason] = useState('');
    const [clarity, setClarity] = useState('');
    const [priority, setPriority] = useState('');
    const [additionalIssues, setAdditionalIssues] = useState('');
    const [infrastructureId, setInfrastructureId] = useState(null);

    // Extract the infrastructureId from the URL query parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            setInfrastructureId(id);
        } else {
            console.error('No infrastructureId found in URL');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the infrastructureId is available
        if (!infrastructureId) {
            alert('Error: No infrastructure ID found!');
            return;
        }

        // Create a JSON object with the issue data
        const issueData = {
            infrastructureId,
            reason,
            clarity,
            priority,
            additionalIssues,
        };

        try {
            console.log('Submitting issue data:', issueData);  // Log the data being submitted
            // Make a POST request with JSON data
            const response = await axios.post('http://localhost:5001/api/report-issue', issueData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Response from API:', response); // Log the response from API
            alert('Issue reported successfully!');
        } catch (error) {
            console.error('Error reporting issue:', error);  // Log the full error details
            if (error.response) {
                console.error('Error response:', error.response);  // Log the error response details
                alert(`Error: ${error.response.data.error}`);
            } else if (error.request) {
                console.error('Error request:', error.request);  // Log the request error
                alert('No response received from the server.');
            } else {
                console.error('Error message:', error.message);  // Log other error details
                alert('There was an unexpected error.');
            }
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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0 20px',
            fontFamily: 'Arial, sans-serif',
        }}>
            <div style={{
                maxWidth: '700px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '30px 40px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}>
                <h2 style={{
                    color: '#a1a7a3',
                    textAlign: 'left',
                    marginBottom: '30px',
                    fontWeight: 'bold',
                }}>
                    Report an Issue
                </h2>
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    alignItems: 'stretch',
                }}>
                    {/* Reason for Reporting */}
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Reason for reporting issue:</label>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '10px',
                            justifyContent: 'space-between',
                        }}>
                            {[ 'Not Working Properly', 'Needs Maintenance', 'Other'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setReason(option)}
                                    style={{
                                        padding: '10px 15px',
                                        borderRadius: '8px',
                                        border: reason === option ? '2px solid #3498db' : '2px solid #bdc3c7',
                                        backgroundColor: reason === option ? '#3498db' : '#ecf0f1',
                                        color: reason === option ? '#fff' : '#2c3e50',
                                        cursor: 'pointer',
                                        flex: '1',
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clarity Text Box */}
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Can you provide clarity on the issue? (50-100 words)</label>
                        <textarea
                            value={clarity}
                            onChange={(e) => setClarity(e.target.value)}
                            rows="4"
                            placeholder="Help us understand the issue better..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #bdc3c7',
                                resize: 'none',
                                fontFamily: 'Arial, sans-serif'
                            }}
                        ></textarea>
                    </div>

                    {/* Priority Selection */}
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Reported issue priority:</label>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '10px',
                            justifyContent: 'space-between',
                        }}>
                            {[
                                { label: 'High', color: '#e74c3c' },
                                { label: 'Medium', color: '#f1c40f' },
                                { label: 'Low', color: '#2ecc71' },
                            ].map(({ label, color }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setPriority(label)}
                                    style={{
                                        padding: '10px 15px',
                                        borderRadius: '8px',
                                        border: priority === label ? `2px solid ${color}` : '2px solid #bdc3c7',
                                        backgroundColor: priority === label ? color : '#ecf0f1',
                                        color: priority === label ? '#fff' : '#2c3e50',
                                        cursor: 'pointer',
                                        flex: '1',
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Issues */}
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Additional issues:</label>
                        <input
                            type="text"
                            value={additionalIssues}
                            onChange={(e) => setAdditionalIssues(e.target.value)}
                            placeholder="Any other issues to mention?"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #bdc3c7',
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            alignSelf: 'center',
                            marginTop: '20px',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        Submit Issue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IssueReportPage;
