import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const codeVerifier = sessionStorage.getItem("code_verifier");

        console.log("OAuth callback received:", { code, error });

        if (!code && !error) {
            navigate("/");
            return;
        }

        if (error) {
            console.error("OAuth Error:", error);
            alert("Something went wrong with Discord login.");
            return;
        }

        if (code && codeVerifier) {
            const handleAuth = async () => {
                try {
                    const response = await fetch(
                        "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/discord-oauth",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ code, codeVerifier }),
                        }
                    );

                    const data = await response.json();
                    if (response.ok) {
                        console.log("Authentication successful:", data);
                        window.location.href = `scrapyardapp://auth?message=${data.message}`;
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
        } else {
            console.error("Missing code verifier or authorization code.");
            alert("Invalid session or missing parameters.");
        }
    }, [navigate]);

    return <div>Authenticating...</div>;
};

export default OAuthCallback;