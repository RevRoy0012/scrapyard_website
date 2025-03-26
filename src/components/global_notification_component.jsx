// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const Global_notification_component = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(!!message);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [message, duration]);

    if (!visible || !message) return null;

    let bgColor = '#6c757d';
    if (type === 'success') bgColor = '#28a745';
    else if (type === 'error') bgColor = '#dc3545';
    else if (type === 'info') bgColor = '#17a2b8';

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: bgColor,
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '5px',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                fontSize: '16px',
            }}
        >
            {message}
        </div>
    );
};

export default Global_notification_component;