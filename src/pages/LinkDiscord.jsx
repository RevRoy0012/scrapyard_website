import React from 'react';

// Hard-coded Discord client ID and front-end URL
const DISCORD_CLIENT_ID = "1312377564005666879";
const FRONTEND_URL = "";

export default function LinkDiscord() {
    const jwt = sessionStorage.getItem('sy_jwt');
    if (!jwt) {
        return <p style={{ color: '#fff' }}>You must be logged in.</p>;
    }

    const handleLinkDiscord = () => {
        const redirectUri = encodeURIComponent(`${FRONTEND_URL}/oauth2/callback`);
        const state = Math.random().toString(36).substring(2);
        sessionStorage.setItem('discord_oauth_state', state);

        const discordAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${state}`;
        window.location.href = discordAuthURL;
    };

    return (
        <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>
            <h1>Link Your Discord Account</h1>
            <p>Click below to link your Discord account.</p>
            <button onClick={handleLinkDiscord} style={{ padding: '10px', background: '#5865F2', color: '#fff', border: 'none', borderRadius: '5px' }}>
                Link Discord
            </button>
        </div>
    );
}