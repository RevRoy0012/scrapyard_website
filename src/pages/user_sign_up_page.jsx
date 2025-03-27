import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Global_notification_component from '../components/global_notification_component.jsx';
import Global_throbber_component from '../components/global_throbber_component.jsx';

const User_sign_up_page = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const handlePasswordChange = (value) => {
        setPassword(value);
        setPasswordValidation({
            length: value.length >= 8,
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        });
    };

    const storeUser = (result) => {
        const userToStore = result.email ? result : { ...result, email: result.user_email || email };
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!email || !emailRegex.test(email)) {
            setNotification({ message: 'Please enter a valid email address.', type: 'error' });
            return;
        }

        if (!username || !usernameRegex.test(username)) {
            setNotification({
                message: 'Username must be alphanumeric and 3–20 characters long.',
                type: 'error',
            });
            return;
        }

        if (!passwordValidation.length || !passwordValidation.hasNumber || !passwordValidation.hasSpecialChar) {
            setNotification({
                message: 'Password must be at least 8 characters, include a number and special character.',
                type: 'error',
            });
            return;
        }

        setIsLoading(true);
        setNotification({ message: '', type: '' });

        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/sign-up',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setIsVerifying(true);
                setNotification({ message: 'Verification code sent. Check your email.', type: 'success' });
            } else {
                setNotification({ message: result.message || 'Sign up failed.', type: 'error' });
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setNotification({ message: 'An error occurred during sign up.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '' });

        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/auth/verify-email',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, auth_code: verificationCode }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                storeUser(result);
                setNotification({ message: 'Sign up successful!', type: 'success' });
                setTimeout(() => navigate('/link-discord'), 1000);
            } else {
                setNotification({ message: result.message || 'Verification failed.', type: 'error' });
            }
        } catch (error) {
            console.error('Error verifying sign up:', error);
            setNotification({ message: 'An error occurred during verification.', type: 'error' });
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
                <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>

                {!isVerifying ? (
                    <form onSubmit={handleSignUp}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="relative mb-2">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
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

                        {isPasswordFocused && (
                            <div className="mb-4 text-sm text-gray-300">
                                <div style={{ textDecoration: passwordValidation.length ? 'line-through' : 'none' }}>
                                    At least 8 characters
                                </div>
                                <div style={{ textDecoration: passwordValidation.hasNumber ? 'line-through' : 'none' }}>
                                    Includes a number
                                </div>
                                <div style={{ textDecoration: passwordValidation.hasSpecialChar ? 'line-through' : 'none' }}>
                                    Includes a special character
                                </div>
                            </div>
                        )}

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

export default User_sign_up_page;