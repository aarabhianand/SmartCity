import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddProvider.css';

const AddProvider = () => {
    const [provider_name, setProviderName] = useState('');
    const [service_type, setServiceType] = useState('');
    const [service_area, setServiceArea] = useState('');
    const [contact_number, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [no_of_members, setNoOfMembers] = useState('');
    const [operational_hours, setOperationalHours] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProvider = {
            provider_name,
            service_type,
            service_area,
            contact_number,
            email,
            no_of_members,
            operational_hours
        };

        // Send the POST request to create a new provider
        axios.post('http://localhost:5001/providers', newProvider)
            .then(response => {
                console.log('New Provider added:', response.data);
                navigate('/providers'); // Redirect back to the provider list
            })
            .catch(error => {
                setError('Failed to add new provider. Please try again.');
                console.error('Error adding provider:', error);
            });
    };

    return (
        <div className="add-provider-container">
            <h1>Add New Provider</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Provider Name:
                    <input
                        type="text"
                        value={provider_name}
                        onChange={(e) => setProviderName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Service Type:
                    <input
                        type="text"
                        value={service_type}
                        onChange={(e) => setServiceType(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Service Area:
                    <input
                        type="text"
                        value={service_area}
                        onChange={(e) => setServiceArea(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Contact Number:
                    <input
                        type="text"
                        value={contact_number}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Number of Members:
                    <input
                        type="number"
                        value={no_of_members}
                        onChange={(e) => setNoOfMembers(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Operational Hours:
                    <input
                        type="text"
                        value={operational_hours}
                        onChange={(e) => setOperationalHours(e.target.value)}
                        required
                    />
                </label>

                <button type="submit">Add Provider</button>
            </form>
        </div>
    );
};

export default AddProvider;
