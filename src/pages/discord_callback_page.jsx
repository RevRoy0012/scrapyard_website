import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Discord_callback_page = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/discord-success');
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

export default Discord_callback_page;