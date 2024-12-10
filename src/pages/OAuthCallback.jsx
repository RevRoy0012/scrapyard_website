import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]); // State to store logs

    // Function to add logs
    const addLog = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
        console.log(message);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const codeVerifier = urlParams.get('code_verifier');

        addLog(`OAuth callback received: code=${code}, error=${error}`);

        // If no code or error, redirect to home
        if (!code && !error) {
            addLog("No code or error in URL parameters, redirecting to home...");
            navigate('/');
            return;
        }

        if (error) {
            addLog(`OAuth Error: ${error}`);
            console.error("OAuth Error:", error);
            alert("Something went wrong with Discord login.");
            return;
        }

        if (code) {
            addLog(`Received code: ${code}`);

            // If code_verifier isn't in URL, we can't proceed.
            if (!codeVerifier) {
                addLog("No code_verifier found in URL. Cannot proceed.");
                alert("Missing code_verifier. Please try logging in again.");
                return;
            }

            addLog("Sending code and code_verifier to API Gateway...");
            const handleAuth = async () => {
                try {
                    const response = await fetch(
                        'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/discord-oauth',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ code, code_verifier: codeVerifier }),
                        }
                    );

                    addLog(`API Gateway response status: ${response.status}`);

                    if (!response.ok) {
                        const errorText = await response.text();
                        addLog(`Failed API response: ${response.status}, ${errorText}`);
                        console.error("Failed API response:", response.status, errorText);
                        alert("Authentication failed. Please try again.");
                        return;
                    }

                    const data = await response.json();
                    addLog(`API Gateway response data: ${JSON.stringify(data)}`);

                    // Check response message and redirect accordingly
                    if (data.message === 'User authenticated successfully') {
                        addLog("Authentication successful, redirecting to app...");
                        // Redirect to your mobile app URI scheme or wherever you need
                        window.location.href = `scrapyardapp://auth?message=${data.message}`;
                    } else {
                        addLog(`Authentication failed: ${JSON.stringify(data)}`);
                        console.error("Authentication failed:", data);
                        alert("Authentication failed.");
                    }
                } catch (err) {
                    addLog(`Error handling auth: ${err.message}`);
                    console.error("Error handling auth:", err);
                    alert("Failed to authenticate.");
                }
            };

            handleAuth();
        }
    }, [navigate]);

    return (
        <div>
            <h1>Authenticating...</h1>
            <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                <h3>Logs</h3>
                <ul style={{ listStyleType: 'none', padding: '0', fontFamily: 'monospace', fontSize: '14px' }}>
                    {logs.map((log, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OAuthCallback;