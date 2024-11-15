import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddInspector.css';

const AddInspector = () => {
    const [inspector_name, setInspectorName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [spec, setSpec] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newInspector = {
            inspector_name,
            phone_number,
            email,
            spec
        };

        // Send the POST request to create a new infrastructure
        axios.post('http://localhost:5001/inspectors', newInspector)
            .then(response => {
                console.log('New Inspector added:', response.data);
                navigate('/inspectors'); // Redirect back to the infrastructure list
            })
            .catch(error => {
                setError('Failed to add new inspector. Please try again.');
                console.error('Error adding inspector:', error);
            });
    };

    return (
        <div className="add-inspector-container">
            <h1>Add New Inspector</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={inspector_name}
                        onChange={(e) => setInspectorName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                    Specialisation:
                    <select
                        value={spec}
                        onChange={(e) => setSpec(e.target.value)}
                    >
                        <option value="Health">Health Inspector</option>
                        <option value="Quality">Quality Inspector</option>
                        <option value="Safety">Safety Inspector</option>
                        <option value="Environmental">Environmental Inspector</option>
                    </select>
                </label>
                
                

                <button type="submit">Add Inspector</button>
            </form>
        </div>
    );
};

export default AddInspector;
