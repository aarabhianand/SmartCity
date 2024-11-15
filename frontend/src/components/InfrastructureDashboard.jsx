import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/InfraDash.css';

const InfrastructureDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [infrastructure, setInfrastructure] = useState(null);
    const [utilityProvider, setUtilityProvider] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [sensorTypes, setSensorTypes] = useState([]);
    const [selectedSensorType, setSelectedSensorType] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Sensor Value Over Time',
            data: [],
            borderColor: 'rgba(41,128,185,1)',
            backgroundColor: 'rgba(41,128,185,0.2)',
            fill: true,
        }]
    });
    useEffect(() => {
        // Add a class to the body when the component is mounted
        document.body.classList.add('infra-background');

        // Clean up by removing the class on unmount
        return () => {
            document.body.classList.remove('infra-background');
        };
    }, []);

    useEffect(() => {
        fetchSensorTypes();
    }, []);

    useEffect(() => {
        if (selectedSensorType && startDate && endDate) {
            fetchInfrastructureData();
        }
    }, [startDate, endDate, selectedSensorType]);

    const fetchSensorTypes = () => {
        axios.get(`http://localhost:5001/infrastructure/${id}/sensor-types`)
            .then(response => {
                setSensorTypes(response.data.sensorTypes);
                setSelectedSensorType(response.data.sensorTypes[0]);
            })
            .catch(error => console.error('Error fetching sensor types:', error))
            .finally(() => setLoading(false));
    };

    const fetchInfrastructureData = () => {
        const dateParams = {
            date: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            },
            type: selectedSensorType,
        };

        axios.get(`http://localhost:5001/infrastructure/${id}`, { params: dateParams })
            .then(response => {
                const { infrastructure, provider_name, contact_number, sensorData } = response.data;
                setInfrastructure(infrastructure);
                setUtilityProvider({ provider_name, contact_number });
                setSensorData(sensorData);
                prepareChartData(sensorData);
            })
            .catch(error => console.error('Error fetching infrastructure data:', error));
    };

    const prepareChartData = (data) => {
        if (data.length === 0) return;

        const labels = data.map(item => new Date(item.datetime_collection).toLocaleString().slice(0, 16)); // Compact date-time format
        const values = data.map(item => item.value);

        setChartData({
            labels,
            datasets: [{
                label: `${selectedSensorType} Value Over Time`,
                data: values,
                borderColor: 'rgba(41,128,185,1)',
                backgroundColor: 'rgba(41,128,185,0.2)',
                fill: true,
            }]
        });
    };

    const handleReportIssue = () => {
        navigate(`/issues?id=${id}`);
    };

    return (
        <div className="dashboard-container">
            <h2 classname="dashboard-title">Infrastructure Dashboard</h2>

            <div className="sensor-selector">
                <label>Select Sensor Type: </label>
                <select value={selectedSensorType} onChange={(event) => setSelectedSensorType(event.target.value)}>
                    {sensorTypes.length > 0 ? (
                        sensorTypes.map(type => <option key={type} value={type}>{type}</option>)
                    ) : (
                        <option disabled>No Sensor Types Available</option>
                    )}
                </select>
            </div>

            <div className="date-picker-container">
                <label>Select Start Date:</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div className="date-picker-container">
                <label>Select End Date:</label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>

            {startDate && endDate ? (
                <>
                    {infrastructure || utilityProvider ? (
                        <div className="infrastructure-details">
                            <img src={infrastructure.image_url} alt={infrastructure.type} />
                            <p><strong>Location:</strong> {infrastructure.location}</p>
                            <p><strong>Status:</strong> {infrastructure.status}</p>
                            <p><strong>Utility Provider:</strong> {utilityProvider.provider_name}</p>
                            <p><strong>Contact:</strong> {utilityProvider.contact_number}</p>
                        </div>
                    ) : (
                        <div className="chart-placeholder">No data available for the selected dates</div>
                    )}

                    {sensorData.length > 0 && !loading ? (
                        <div className="chart-container">
                            <Line data={chartData} />
                        </div>
                    ) : (
                        <div className="chart-placeholder">Loading chart...</div>
                    )}
                </>
            ) : (
                <div className="chart-placeholder">Select valid dates</div>
            )}

            <button onClick={handleReportIssue} className="report-button">
                Report Issue
            </button>
        </div>
    );
};

export default InfrastructureDashboard;
