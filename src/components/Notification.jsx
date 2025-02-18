// src/components/Notification.jsx
import React from 'react';

const Notification = ({ message, type }) => {
    if (!message) return null;

    // Basic styles; adjust as needed for your site design.
    const baseStyle = {
        padding: '10px 20px',
        borderRadius: '5px',
        margin: '10px 0',
        textAlign: 'center',
        fontSize: '16px',
        transition: 'opacity 0.3s ease-in-out',
    };

    let style = {};
    switch (type) {
        case 'success':
            style = { backgroundColor: '#28a745', color: '#fff' };
            break;
        case 'error':
            style = { backgroundColor: '#dc3545', color: '#fff' };
            break;
        case 'info':
            style = { backgroundColor: '#17a2b8', color: '#fff' };
            break;
        default:
            style = { backgroundColor: '#6c757d', color: '#fff' };
            break;
    }
    return <div style={{ ...baseStyle, ...style }}>{message}</div>;
};

export default Notification;