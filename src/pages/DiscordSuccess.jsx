// src/pages/DiscordSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscordSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optionally, you could trigger a profile refresh here if needed.
        // For example, you could fetch the updated profile and update localStorage.
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h2 className="text-3xl font-bold mb-4">Discord Linked Successfully!</h2>
            <p className="mb-4">Your Discord account has been linked to your profile.</p>
            <button
                onClick={() => navigate('/profile')}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mb-2"
            >
                Go to Your Profile
            </button>
            <button
                onClick={() => navigate('/')}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
                Go Home
            </button>
        </div>
    );
};

export default DiscordSuccess;