// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();

    // Form state
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Verification state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/auth/sign-up',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                // Assume a verification code is sent to the user's email.
                setIsVerifying(true);
            } else {
                alert(result.message || 'Sign up failed.');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            alert('An error occurred during sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/auth/sign-up',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, auth_code: verificationCode }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(result));
                navigate('/link-discord');
            } else {
                alert(result.message || 'Verification failed.');
            }
        } catch (error) {
            console.error('Error verifying sign up:', error);
            alert('An error occurred during verification.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow">
                <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>
                {!isVerifying ? (
                    <form onSubmit={handleSignUp}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="w-full bg-red-500 p-3 rounded text-white">
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <p className="text-white mb-4">Enter the verification code sent to your email</p>
                        <input
                            type="text"
                            placeholder="Verification Code"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <button type="submit" className="w-full bg-red-500 p-3 rounded text-white">
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                )}
                <p className="mt-4 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;