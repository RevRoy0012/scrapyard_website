import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <p className="text-white">Loading profile...</p>
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