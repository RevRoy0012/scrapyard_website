import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Global_throbber_component from '../components/global_throbber_component.jsx';
import Global_notification_component from '../components/global_notification_component.jsx';

const user_sign_in_page = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const storeUser = (result) => {
        const userToStore = result.email ? result : { ...result, email: result.user_email || email };
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setNotification({ message: 'Please enter both email and password.', type: 'error' });
            return;
        }

        if (!isValidEmail(email)) {
            setNotification({ message: 'Invalid email format.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setNotification({ message: '', type: '' });

        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/sign-in',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                storeUser(result);
                onLoginSuccess();
                setNotification({ message: 'Login successful. Redirecting...', type: 'success' });
                setTimeout(() => navigate('/link-discord'), 1000);
            } else {
                setNotification({ message: result.message || 'Sign in failed.', type: 'error' });
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            setNotification({ message: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 relative">
            {isLoading && <Global_throbber_component />}
            <Global_notification_component
                message={notification.message}
                type={notification.type}
                duration={4000}
            />

            <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow relative">
                <button onClick={() => navigate('/')} className="mb-4 text-white underline absolute top-4 left-4">
                    &larr; Back
                </button>
                <h2 className="text-2xl text-white mb-6 text-center">Sign In</h2>

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

export default user_sign_in_page;