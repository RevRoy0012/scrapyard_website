import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]); // State to store logs

    const addLog = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
        console.log(message);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        addLog(`OAuth callback received: code=${code}, error=${error}`);

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

            // Retrieve code_verifier from localStorage
            const codeVerifier = localStorage.getItem("code_verifier");
            addLog(`LocalStorage code_verifier: ${codeVerifier}`);

            if (!codeVerifier) {
                addLog("No code_verifier found in localStorage. Cannot proceed.");
                alert("Missing code_verifier. Please try logging in again.");
                return;
            }

            const handleAuth = async () => {
                try {
                    addLog("Sending code and code_verifier to API Gateway...");
                    const response = await fetch(
                        'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/discord-oauth',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
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

                    if (data.message === 'User authenticated successfully') {
                        addLog("Authentication successful, redirecting to app...");
                        // Redirect back to your mobile app or wherever
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