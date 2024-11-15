import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddInfrastructure.css';

const AddInfrastructure = () => {
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [installed_date, setInstalledDate] = useState('');
    const [status, setStatus] = useState('Operational');
    const [provider_id, setProviderId] = useState('');
    const [super_infrastructure_id, setSuperInfrastructureId] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newInfrastructure = {
            type,
            location,
            installed_date,
            status,
            provider_id,
            super_infrastructure_id,
            image_url,
        };

        // Send the POST request to create a new infrastructure
        axios.post('http://localhost:5001/infrastructures', newInfrastructure)
            .then(response => {
                console.log('New infrastructure added:', response.data);
                navigate('/infrastructures'); // Redirect back to the infrastructure list
            })
            .catch(error => {
                setError('Failed to add new infrastructure. Please try again.');
                console.error('Error adding infrastructure:', error);
            });
    };

    return (
        <div className="add-infrastructure-container">
            <h1>Add New Infrastructure</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Type:
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Installed Date:
                    <input
                        type="date"
                        value={installed_date}
                        onChange={(e) => setInstalledDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Status:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Operational">Operational</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Construction">Construction</option>
                    </select>
                </label>
                <label>
                    Provider ID:
                    <input
                        type="number"
                        value={provider_id}
                        onChange={(e) => setProviderId(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Super Infrastructure ID:
                    <input
                        type="number"
                        value={super_infrastructure_id}
                        onChange={(e) => setSuperInfrastructureId(e.target.value)}
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={image_url}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </label>

                <button type="submit">Add Infrastructure</button>
            </form>
        </div>
    );
};

export default AddInfrastructure;
