import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/InfraList.css';

const InfrastructureList = () => {
    const [infrastructures, setInfrastructures] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Add a class to the body when the component is mounted
        document.body.classList.add('infra-background');

        // Clean up by removing the class on unmount
        return () => {
            document.body.classList.remove('infra-background');
        };
    }, []); // Empty dependency array to run only on mount and unmount

    useEffect(() => {
        axios.get('http://localhost:5001/infrastructure')
            .then((response) => {
                console.log(response.data); // Log the response data for debugging
                setInfrastructures(response.data);
            })
            .catch((error) => console.error('Error fetching infrastructures:', error));
    }, []);

    const handleCardClick = (id) => {
        navigate(`/infrastructure/${id}`);
    };

    return (
        <div className="infrastructure-list">
            <h2>Infrastructure Overview</h2>
            <div className="card-container">
                {infrastructures.map((infra) => (
                    <div key={infra.infrastructure_id} className="flip-card" onClick={() => handleCardClick(infra.infrastructure_id)}>
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={infra.image_url} alt={infra.type} />
                                <h3>{infra.type}</h3>
                            </div>
                            <div className="flip-card-back">
                                <p>Location: {infra.location}</p>
                                <p>Status: {infra.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfrastructureList;
