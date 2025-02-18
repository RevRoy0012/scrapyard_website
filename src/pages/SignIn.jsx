import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    // Helper to store the user data (ensuring an "email" field).
    const storeUser = (result) => {
        const userToStore = result.email ? result : { ...result, email: result.user_email || email };
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        setIsLoading(true);
        setNotification('Signing in...');
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
                    setNotification('Verification required. Check your email.');
                } else {
                    storeUser(result);
                    onLoginSuccess();
                    setNotification('Login successful!');
                    setTimeout(() => {
                        navigate('/link-discord');
                    }, 1000);
                }
            } else {
                alert(result.message || 'Sign in failed.');
                setNotification('');
            }
        } catch (error) {
            console.error('Error signing in', error);
            alert('An error occurred during sign in.');
            setNotification('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!verificationCode) {
            alert('Please enter the verification code');
            return;
        }
        setIsLoading(true);
        setNotification('Verifying...');
        try {
            const response = await fetch(
                'https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/mobile/auth/sign-in',
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
                setNotification('Login successful!');
                setTimeout(() => {
                    navigate('/link-discord');
                }, 1000);
            } else {
                alert(result.message || 'Verification failed.');
                setNotification('');
            }
        } catch (error) {
            console.error('Error verifying sign in', error);
            alert('An error occurred during verification.');
            setNotification('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow">
                <h2 className="text-2xl text-white mb-6 text-center">Sign In</h2>
                {!isVerifying ? (
                    <form onSubmit={handleSignIn}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
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
                {notification && (
                    <div className="mt-4 text-center text-white">
                        <span>{notification}</span>
                        {isLoading && (
                            <div className="inline-block ml-2 border-t-2 border-b-2 border-white animate-spin h-4 w-4"></div>
                        )}
                    </div>
                )}
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