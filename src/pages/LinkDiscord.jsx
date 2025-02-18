// src/pages/LinkDiscord.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkDiscord = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setUser(null);
            setChecking(false);
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setChecking(false);
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user || !(user.email || user.user_email)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <p className="text-white mb-4">You must be signed in to link your Discord account.</p>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded"
                    onClick={() => navigate('/login')}
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    // If the user is already linked, show a message and a button to go to profile.
    if (user.discord_linked) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <h2 className="text-2xl text-white mb-6">Your Discord is already linked!</h2>
                <p className="text-gray-300 mb-4">
                    You can ignore this page and proceed to your profile.
                </p>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
                >
                    Go to Your Profile
                </button>
            </div>
        );
    }

    // Build the Discord OAuth URL using the user's email as state.
    const userEmail = user.email || user.user_email;
    const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=1312377564005666879&response_type=code&redirect_uri=${encodeURIComponent(
        'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/discord-link'
    )}&scope=identify+email&state=${encodeURIComponent(userEmail)}`;

    const handleLinkDiscord = () => {
        window.location.href = discordOAuthUrl;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <h2 className="text-2xl text-white mb-6">Link Your Discord Account</h2>
            <p className="text-gray-300 mb-4">
                Linking your Discord account will provide you with a unified experience on ScrapYard.
            </p>
            <button
                onClick={handleLinkDiscord}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
            >
                Link Discord
            </button>
            <button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded mt-4"
            >
                No Thanks
            </button>
        </div>
    );
};

export default LinkDiscord;