// src/pages/DiscordCallback.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DiscordCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Optionally, parse query parameters if needed:
        const query = new URLSearchParams(location.search);
        // You could use any parameter (like a "success" flag) here.

        // Redirect after a short delay (if needed)
        const timer = setTimeout(() => {
            navigate('/link-discord');
        }, 3000);
        return () => clearTimeout(timer);
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
                <h2>Linking Discord Account...</h2>
                <p>Please wait, you will be redirected shortly.</p>
            </div>
        </div>
    );
};

export default DiscordCallback;