import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 

const SensorChart = () => {
    const [sensorData, setSensorData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Sensor Value Over Time',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [infrastructure, setInfrastructure] = useState('Downtown Area');

    const fetchData = () => {
        axios.get('http://localhost:5001/dashboard', {
            params: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                sensorType: 'Temperature',
                location: infrastructure,
            }
        })
        .then((response) => {
            console.log("API Response:", response.data); 
            setSensorData(response.data);
            prepareChartData(response.data);
        })
        .catch((error) => {
            console.error("Error fetching sensor data:", error);
        });
    };

    const prepareChartData = (data) => {
        if (data.length === 0) return;

        const labels = data.map(item => new Date(item.datetime_collection).toLocaleString());
        const values = data.map(item => item.value);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Sensor Value Over Time',
                    data: values,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: true,
                },
            ],
        });
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, infrastructure]);

    return (
        <div>
            <h2>Sensor Data Visualization</h2>
            <div>
                <label>Select Infrastructure:</label>
                <select value={infrastructure} onChange={(e) => setInfrastructure(e.target.value)}>
                    <option value="Downtown Area">Downtown Area</option>
                    <option value="Greenfield Park Playground">Greenfield Park Playground</option>
                </select>
            </div>
            <div>
                <label>Select Start Date:</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div>
                <label>Select End Date:</label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
            <button onClick={fetchData}>Fetch Data</button>
            {chartData.labels.length > 0 ? <Line data={chartData} /> : <p>No data available</p>}
        </div>
    );
};

export default SensorChart;
