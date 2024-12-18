import React, { useState } from 'react';

// Hard-coded endpoint for secure sign-in
const SIGN_IN_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/secure-sign-in";

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch(SIGN_IN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (response.ok) {
            // Store JWT in sessionStorage
            sessionStorage.setItem('sy_jwt', result.jwt);
            onLoginSuccess();
        } else {
            alert(result.message || "Login failed.");
        }
    };

    return (
        <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
            <h1>Sign In to ScrapYard</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ marginBottom: '10px', padding: '8px' }}
            />
            <button onClick={handleLogin} style={{ padding: '10px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '5px' }}>
                Log In
            </button>
        </div>
    );
}