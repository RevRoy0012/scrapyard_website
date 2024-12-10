import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (!code && !error) {
            // Redirect if no query parameters are present
            navigate('/');
            return;
        }

        if (error) {
            console.error("OAuth Error:", error);
            alert("Something went wrong with Discord login.");
        } else if (code) {
            // Send the code to the API Gateway endpoint
            const handleAuth = async () => {
                try {
                    const response = await fetch(
                        'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/discord-oauth',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ code }),
                        }
                    );

                    const data = await response.json();
                    if (data.token) {
                        // Redirect to your app's deep link (optional)
                        window.location.href = `syapp://auth?token=${data.token}`;
                    } else {
                        console.error("Authentication failed:", data);
                        alert("Authentication failed.");
                    }
                } catch (err) {
                    console.error("Error handling auth:", err);
                    alert("Failed to authenticate.");
                }
            };

            handleAuth();
        }
    }, [navigate]);

    return <div>Authenticating...</div>;
};

export default OAuthCallback;