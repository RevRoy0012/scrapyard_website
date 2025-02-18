// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Notification from '../components/Notification';

const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
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

    const getPasswordStrength = () => {
        const { length, hasNumber, hasSpecialChar } = passwordValidation;
        if (!password) return '';
        if (!length) return 'Too Short';
        const criteriaMet = [hasNumber, hasSpecialChar].filter(Boolean).length;
        if (criteriaMet === 0) return 'Weak';
        if (criteriaMet === 1) return 'Moderate';
        return 'Strong';
    };

    const storeUser = (result) => {
        const userToStore = result.email ? result : { ...result, email: result.user_email || email };
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: 'Signing up...', type: 'info' });
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
        setNotification({ message: 'Verifying...', type: 'info' });
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
                setTimeout(() => {
                    navigate('/link-discord');
                }, 1000);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow">
                <button onClick={() => navigate('/')} className="mb-4 text-white underline">
                    &larr; Back
                </button>
                <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>
                {!isVerifying ? (
                    <form onSubmit={handleSignUp}>
                        {/* Username field */}
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {/* Email field */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {/* Password field */}
                        <div className="relative mb-2">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full p-3 rounded bg-gray-700 text-white"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
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
                        {password && (
                            <div className="text-sm text-gray-300 mb-4">
                                Password Strength: <span className="font-semibold">{getPasswordStrength()}</span>
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
                <Notification message={notification.message} type={notification.type} />
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