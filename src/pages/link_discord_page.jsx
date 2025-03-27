import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Global_throbber_component from '../components/global_throbber_component.jsx';

const Link_discord_page = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    // Function to fetch fresh profile data from backend using the stored email.
    const fetchUserData = async (storedUser) => {
        try {
            const response = await fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${storedUser.email}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            const updatedUser = { ...storedUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Error fetching fresh user data:', error);
            return storedUser;
        }
    };

    useEffect(() => {
        const checkUserStatus = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setUser(null);
                setChecking(false);
                return;
            }
            const parsedUser = JSON.parse(storedUser);
            const freshUser = await fetchUserData(parsedUser);
            setUser(freshUser);
            setChecking(false);
            if (freshUser.discord_linked) {
                navigate('/profile');
            }
        };

        checkUserStatus();
    }, [navigate]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <Global_throbber_component />
            </div>
        );
    }

    if (!user || !(user.email || user.user_email)) {
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

export default Link_discord_page;