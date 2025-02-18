// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';
import Spinner from '../components/Spinner';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const storeUser = (result) => {
        const userToStore = result.email ? result : { ...result, email: result.user_email || email };
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setNotification({ message: 'Please enter email and password.', type: 'error' });
            return;
        }
        setIsLoading(true);
        setNotification({ message: 'Signing in...', type: 'info' });
        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/auth/sign-in',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                if (result.requiresVerification) {
                    setIsVerifying(true);
                    setNotification({ message: 'Verification required. Check your email.', type: 'info' });
                } else {
                    storeUser(result);
                    onLoginSuccess();
                    setNotification({ message: 'Login successful!', type: 'success' });
                    setTimeout(() => {
                        navigate('/link-discord');
                    }, 1000);
                }
            } else {
                setNotification({ message: result.message || 'Sign in failed.', type: 'error' });
            }
        } catch (error) {
            console.error('Error signing in', error);
            setNotification({ message: 'An error occurred during sign in.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode) {
            setNotification({ message: 'Please enter the verification code.', type: 'error' });
            return;
        }
        setIsLoading(true);
        setNotification({ message: 'Verifying...', type: 'info' });
        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/sign-in',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, auth_code: verificationCode }),
                }
            );
            const result = await response.json();
            if (response.ok) {
                storeUser(result);
                onLoginSuccess();
                setNotification({ message: 'Login successful!', type: 'success' });
                setTimeout(() => {
                    navigate('/link-discord');
                }, 1000);
            } else {
                setNotification({ message: result.message || 'Verification failed.', type: 'error' });
            }
        } catch (error) {
            console.error('Error verifying sign in', error);
            setNotification({ message: 'An error occurred during verification.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            {isLoading && <Spinner />}
            <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow relative">
                <button onClick={() => navigate('/')} className="mb-4 text-white underline absolute top-4 left-4">
                    &larr; Back
                </button>
                <h2 className="text-2xl text-white mb-6 text-center">Sign In</h2>
                {!isVerifying ? (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-white"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <button onClick={handleSignIn} className="w-full bg-red-500 p-3 rounded text-white">
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-white mb-4">Enter the verification code sent to your email</p>
                        <input
                            type="text"
                            placeholder="Verification Code"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <button onClick={handleVerify} className="w-full bg-red-500 p-3 rounded text-white">
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </button>
                    </>
                )}
                <Notification message={notification.message} type={notification.type} />
                <p className="mt-4 text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-red-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;