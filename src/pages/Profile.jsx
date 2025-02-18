import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve the user from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const localUser = JSON.parse(storedUser);

        // Fetch the up-to-date profile data from the secure endpoint.
        fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Assumes you store the JWT token as jwtToken in local storage.
                'Authorization': `Bearer ${localUser.jwtToken}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // Update the user state with fresh data.
                setUser(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
                // Fall back to local user data if an error occurs.
                setUser(localUser);
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <p className="text-white">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <p className="text-white">No user data available.</p>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
            <img
                src={user.profilePicture || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
            />
            <p className="text-lg mb-2">Email: {user.email}</p>
            <p className="text-lg mb-2">Username: {user.username || 'N/A'}</p>
            <p className="text-lg mb-2">
                Discord Linked: {user.discord_linked ? 'Yes' : 'No'}
            </p>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;