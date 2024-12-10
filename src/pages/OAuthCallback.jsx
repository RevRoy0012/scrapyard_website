import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        console.log("OAuth callback received:", { code, error });

        if (!code && !error) {
            console.warn("No code or error in URL parameters, redirecting to home...");
            navigate('/');
            return;
        }

        if (error) {
            console.error("OAuth Error:", error);
            alert("Something went wrong with Discord login.");
            return;
        }

        if (code) {
            console.log("Received code:", code);

            // Send the code to the API Gateway endpoint
            const handleAuth = async () => {
                try {
                    console.log("Sending code to API Gateway...");
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

                    console.log("API Gateway response status:", response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Failed API response:", response.status, errorText);
                        alert("Authentication failed. Please try again.");
                        return;
                    }

                    const data = await response.json();
                    console.log("API Gateway response data:", data);

                    if (data.message === 'User successfully authenticated and stored') {
                        console.log("Authentication successful, redirecting to app...");
                        window.location.href = `syapp://auth?message=${data.message}`;
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