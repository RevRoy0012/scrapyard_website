// src/pages/DiscordSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscordSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the stored user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Fetch updated profile data using the stored email as query parameter
            fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${user.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // Since we're no longer using JWT, we just need the email.
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    // Merge the fetched data into the stored user object
                    const updatedUser = { ...user, ...data };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                })
                .catch((error) => {
                    console.error("Error updating user data on Discord success:", error);
                });
        }
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