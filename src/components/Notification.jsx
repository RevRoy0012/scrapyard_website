// src/components/Notification.jsx
import React from 'react';

const Notification = ({ message, type }) => {
    if (!message) return null;
    // You can adjust styles as needed.
    const bgColor =
        type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    return (
        <div className={`${bgColor} text-white p-3 rounded my-2 text-center`}>
            {message}
        </div>
    );
};

export default Notification;