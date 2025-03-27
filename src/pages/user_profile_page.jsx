// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Global_notification_component from '../components/global_notification_component.jsx';
import Global_throbber_component from "../components/global_throbber_component.jsx";

const User_profile_page = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const localUser = JSON.parse(storedUser);
        setUser(localUser);

        fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${localUser.email}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((data) => {
                const updatedUser = { ...localUser, ...data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        if (onLogout) onLogout();
        navigate('/login');
    };

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) {
            setNotification({ message: 'New username cannot be empty', type: 'error' });
            return;
        }
        setActionLoading(true);
        try {
            const payload = {
                email: user.email,
                currentUsername: user.username,
                newUsername: newUsername,
            };
            const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/change-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                if (!result.user.email) result.user.email = user.email;
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
                setNotification({ message: 'Username updated successfully', type: 'success' });
                setEditingUsername(false);
            } else {
                setNotification({ message: result.message || 'Failed to update username', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating username:', error);
            setNotification({ message: 'An error occurred while updating username', type: 'error' });
        }
        setActionLoading(false);
    };

    const handleUnlinkDiscord = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/unlink-discord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, username: user.username }),
            });
            const result = await response.json();
            if (response.ok) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
                setNotification({ message: 'Discord unlinked successfully', type: 'success' });
            } else {
                setNotification({ message: result.message || 'Failed to unlink Discord', type: 'error' });
            }
        } catch (error) {
            console.error('Error unlinking Discord:', error);
            setNotification({ message: 'An error occurred while unlinking Discord', type: 'error' });
        }
        setActionLoading(false);
    };

    const handleResendVerification = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/resend-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, username: user.username }),
            });
            const result = await response.json();
            if (response.ok) {
                setNotification({ message: 'Verification email sent', type: 'success' });
            } else {
                setNotification({ message: result.message || 'Failed to send verification email', type: 'error' });
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            setNotification({ message: 'An error occurred while sending verification email', type: 'error' });
        }
        setActionLoading(false);
    };

    if (loading) {
        return <Global_throbber_component />;
    }
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>No user data available.</p>
            </div>
        );
    }

    // Format Credits (e.g., "$1,234,567")
    const formattedCredits = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(user.Credits);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 relative">
            {/* Notification Toast */}
            <Global_notification_component message={notification.message} type={notification.type} />
            {/* Action Spinner Overlay */}
            {actionLoading && <Global_throbber_component />}
            <div className="bg-gray-800 p-8 rounded shadow w-full max-w-md mt-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Your Profile</h2>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                        Logout
                    </button>
                </div>
                <div className="flex justify-center mb-6">
                    <img
                        src="/default-profile.png"
                        alt="Profile"
                        className="w-24 h-24 rounded-full"
                    />
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-lg">
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg">
                            <span className="font-semibold">Username:</span>{' '}
                            {editingUsername ? (
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="p-1 rounded bg-gray-700 text-white"
                                    placeholder="New Username"
                                />
                            ) : (
                                user.username || 'N/A'
                            )}
                        </p>
                    </div>
                    {user.Credits !== undefined && (
                        <div>
                            <p className="text-lg">
                                <span className="font-semibold">Credits:</span> {formattedCredits}
                            </p>
                        </div>
                    )}
                    <div>
                        <p className="text-lg">
                            <span className="font-semibold">Discord Linked:</span>{' '}
                            {user.discord_id || user.discord_linked ? 'Yes' : 'No'}
                        </p>
                        {/* Show Link Discord button if not linked */}
                        {!(user.discord_id || user.discord_linked) && (
                            <button
                                onClick={() => navigate('/link-discord')}
                                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
                            >
                                Link Discord
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-lg">
                            <span className="font-semibold">Email Verified:</span>{' '}
                            {user.verified_email ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
                <div className="mt-8 space-y-3">
                    {!editingUsername && (
                        <button
                            onClick={() => {
                                setEditingUsername(true);
                                setNewUsername(user.username || '');
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                        >
                            Change Username
                        </button>
                    )}
                    {editingUsername && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleChangeUsername}
                                className="flex-grow bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                            >
                                Update Username
                            </button>
                            <button
                                onClick={() => {
                                    setEditingUsername(false);
                                    setNewUsername('');
                                }}
                                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    {user.discord_id || user.discord_linked ? (
                        <button
                            onClick={handleUnlinkDiscord}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                        >
                            Unlink Discord
                        </button>
                    ) : null}
                    {!user.verified_email && (
                        <button
                            onClick={handleResendVerification}
                            className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                        >
                            Verify Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User_profile_page;