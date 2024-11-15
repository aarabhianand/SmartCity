import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

// Custom hook to use the UserContext
export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Start with null
    const [loading, setLoading] = useState(true); // Track loading state

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', credentials);
            const userData = response.data;

            // Ensure email, role, and other necessary fields are present in the user data
            if (userData.email && userData.role) {
                // Save the user data (including the role) to the state and localStorage
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.error("Required fields missing from response data:", userData);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid credentials. Please try again.');
        }
    };

    const logout = () => {
        // Clear user data and remove from localStorage
        setUser(null);
        localStorage.removeItem('user');
    };

    // Load user from localStorage on initial app load if not already in state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Once loading is done, set loading to false
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {loading ? <div>Loading...</div> : children} {/* Show loading until user state is set */}
        </UserContext.Provider>
    );
};
