import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

// Hard-coded endpoint for discord-link
const DISCORD_LINK_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/discord-link";

export default function DiscordCallback() {
    const location = useLocation();
    const history = useHistory();
    const jwt = sessionStorage.getItem('sy_jwt');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const storedState = sessionStorage.getItem('discord_oauth_state');

        if (!jwt) {
            alert("You're not logged in. Please log in first.");
            history.push('/');
            return;
        }

        if (!code || !state || state !== storedState) {
            alert("Invalid Discord authorization.");
            history.push('/link-discord');
            return;
        }

        (async () => {
            const response = await fetch(DISCORD_LINK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
                body: JSON.stringify({ code })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Discord account linked successfully!');
                // Navigate to main-app or another page of your choice
                history.push('/main-app');
            } else {
                alert(result.message || "Failed to link Discord account.");
                history.push('/link-discord');
            }
        })();
    }, [location, history, jwt]);

    return <p style={{ color: '#fff' }}>Linking your Discord account, please wait...</p>;
}