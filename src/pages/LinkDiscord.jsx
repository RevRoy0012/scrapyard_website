// src/pages/LinkDiscord.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkDiscord = () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const userEmail = user ? (user.email || user.user_email) : null;
    if (!user || !userEmail) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
                <p className="text-white mb-4">
                    You must be signed in to link your Discord account.
                </p>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded"
                    onClick={() => navigate('/login')}
                >
                    Go to Sign In
                </button>
            </div>
        );
    }

    // If discord is already linked, redirect to profile.
    if (user.discord_linked) {
        navigate('/profile');
        return null;
    }

    // Build the Discord OAuth URL using the user's email as state.
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
                Linking your Discord account will provide you with a unified experience on ScrapYard! Would you like to link your Discord account?
            </p>
            <button
                onClick={handleLinkDiscord}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded"
            >
                Link Discord
            </button>
            <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded mt-4">
                No Thanks
            </button>
        </div>
    );
};

export default LinkDiscord;