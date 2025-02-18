// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import Spinner from '../components/Spinner';

const Profile = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    // Load the user from localStorage and then refresh profile data from server.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const localUser = JSON.parse(storedUser);

        // Fetch up-to-date profile data using email query.
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
                setUser(localUser);
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        onLogout && onLogout();
        navigate('/login');
    };

    // Handle username update.
    const handleChangeUsername = async () => {
        if (!newUsername.trim()) {
            setNotification({ message: 'New username cannot be empty', type: 'error' });
            return;
        }
        setActionLoading(true);
        try {
            const response = await fetch('https://your-api-url/change-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, currentUsername: user.username, newUsername }),
            });
            const result = await response.json();
            if (response.ok) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
                setNotification({ message: 'Username updated successfully', type: 'success' });
                setEditingUsername(false);
            } else {
                setNotification({ message: result.message || 'Failed to update username', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating username:', error);
            setNotification({ message: 'An error occurred', type: 'error' });
        }
        setActionLoading(false);
    };

    // Handle unlinking Discord.
    const handleUnlinkDiscord = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('https://your-api-url/unlink-discord', {
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
            setNotification({ message: 'An error occurred', type: 'error' });
        }
        setActionLoading(false);
    };

    // Handle resending verification email.
    const handleResendVerification = async () => {
        setActionLoading(true);
        try {
            const response = await fetch('https://your-api-url/resend-verification-email', {
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
            setNotification({ message: 'An error occurred', type: 'error' });
        }
        setActionLoading(false);
    };

    if (loading) {
        return <Spinner />;
    }
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p>No user data available.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 relative">
            {/* Fixed notification at top */}
            <Notification message={notification.message} type={notification.type} />
            {actionLoading && <Spinner />}
            <div className="bg-gray-800 p-6 rounded shadow w-full max-w-md mt-16">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Your Profile</h2>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                        Logout
                    </button>
                </div>
                <img
                    src={user.profilePicture || '/default-profile.png'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto my-4"
                />
                <div className="mb-4">
                    <p className="text-lg"><span className="font-semibold">Email:</span> {user.email}</p>
                    <p className="text-lg">
                        <span className="font-semibold">Username:</span>{" "}
                        {editingUsername ? (
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="p-1 rounded bg-gray-700 text-white"
                                placeholder="New Username"
                            />
                        ) : (
                            user.username
                        )}
                    </p>
                    <p className="text-lg mb-2">
                        <span className="font-semibold">Discord Linked:</span>{" "}
                        {user.discord_linked ? "Yes" : "No"}
                    </p>
                    <p className="text-lg mb-2">
                        <span className="font-semibold">Email Verified:</span>{" "}
                        {user.verified_email ? "Yes" : "No"}
                    </p>
                </div>
                {/* Action Buttons */}
                <div className="space-y-3">
                    {!editingUsername && (
                        <button
                            onClick={() => {
                                setEditingUsername(true);
                                setNewUsername(user.username);
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
                                {actionLoading ? "Updating..." : "Update Username"}
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
                    {user.discord_linked && (
                        <button
                            onClick={handleUnlinkDiscord}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                        >
                            {actionLoading ? "Processing..." : "Unlink Discord"}
                        </button>
                    )}
                    {!user.verified_email && (
                        <button
                            onClick={handleResendVerification}
                            className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                        >
                            {actionLoading ? "Sending..." : "Verify Email"}
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;