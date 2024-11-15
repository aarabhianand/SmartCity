import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Requests.css';

const MaintenanceRequest = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [infrastructureFilter, setInfrastructureFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [infrastructures, setInfrastructures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isButtonLoading, setIsButtonLoading] = useState(false); // For managing button loading state

    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchInfrastructures = async () => {
            if (!providerId) return;
            try {
                const infrastructuresResponse = await axios.get(
                    `http://localhost:5001/api/infrastructures/${providerId}`
                );
                setInfrastructures(infrastructuresResponse.data);
            } catch (error) {
                console.error('Error fetching infrastructures:', error);
            }
        };

        const fetchRequests = async () => {
            if (!providerId) return;
            try {
                const response = await axios.get(`http://localhost:5001/api/maintenance-requests/${providerId}`);
                setRequests(response.data);
                setFilteredRequests(response.data);
            } catch (error) {
                console.error('Error fetching maintenance requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInfrastructures();
        fetchRequests();
    }, [providerId]);

    useEffect(() => {
        const filtered = requests.filter((request) => {
            const matchesInfrastructure = infrastructureFilter
                ? request.infrastructure_name?.toLowerCase().includes(infrastructureFilter.toLowerCase())
                : true;

            const matchesDate = dateFilter
                ? new Date(request.request_date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()
                : true;

            return matchesInfrastructure && matchesDate;
        });

        setFilteredRequests(filtered);
    }, [infrastructureFilter, dateFilter, requests]);

    const handleInfrastructureFilterChange = (event) => {
        setInfrastructureFilter(event.target.value);
    };

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';

        const [datePart] = dateString.split('T');
        const date = new Date(datePart);

        if (isNaN(date)) return 'Invalid Date';
        
        return date.toLocaleDateString('en-GB');
    };

    // Function to handle scheduling the request
    const handleScheduleRequest = async () => {
        if (!selectedRequest) return;

        setIsButtonLoading(true); // Disable the button while loading

        try {
            const response = await axios.post('http://localhost:5001/api/schedule-request', {
                request_id: selectedRequest.request_id,
                provider_id: providerId
            });
            console.log(response.data.message);
            setSelectedRequest((prevRequest) => ({
                ...prevRequest,
                status: 'Scheduled'
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error scheduling request:', error);
        } finally {
            setIsButtonLoading(false); // Re-enable the button after request
        }
    };

    // Function to handle canceling the request
    const handleCancelRequest = async () => {
        if (!selectedRequest) return;

        setIsButtonLoading(true); // Disable the button while loading

        try {
            const response = await axios.post('http://localhost:5001/api/cancel-request', {
                request_id: selectedRequest.request_id
            });
            console.log(response.data.message);
            setSelectedRequest((prevRequest) => ({
                ...prevRequest,
                status: 'CANCELLED'
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error canceling request:', error);
        } finally {
            setIsButtonLoading(false); // Re-enable the button after request
        }
    };

    return (
        <div className="maintenance-request-container">
            <h2>Maintenance Requests</h2>
            <div className="filters">
                <label>
                    Infrastructure:
                    <select
                        value={infrastructureFilter}
                        onChange={handleInfrastructureFilterChange}
                        aria-label="Filter by infrastructure"
                    >
                        <option value="">All</option>
                        {infrastructures.map((infra) => (
                            <option key={infra.infrastructure_id} value={infra.infrastructure_name}>
                                {infra.infrastructure_name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Date:
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={handleDateFilterChange}
                        aria-label="Filter by date"
                    />
                </label>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="request-card-container">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <div className="request-card" key={request.request_id}>
                                <p>Date: {formatDate(request.request_date)}</p>
                                <p>Status: {request.status}</p>
                                <button className="view-details-btn" onClick={() => handleViewDetails(request)}>
                                    View Details
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No maintenance requests found for the selected filters.</p>
                    )}
                </div>
            )}

            {isModalOpen && selectedRequest && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                        <h3>Details for {selectedRequest.infrastructure_name}</h3>
                        <p><strong>Infrastructure:</strong> {selectedRequest.infrastructure_name}</p>
                        <p><strong>Description:</strong> {selectedRequest.issues_description}</p>
                        <p><strong>Date:</strong> {formatDate(selectedRequest.request_date)}</p>
                        <div className="modal-actions">
                            <button
                                className="schedule-btn"
                                onClick={handleScheduleRequest}
                                disabled={isButtonLoading}
                            >
                                {isButtonLoading ? 'Scheduling...' : 'Schedule'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancelRequest}
                                disabled={isButtonLoading}
                            >
                                {isButtonLoading ? 'Cancelling...' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceRequest;
