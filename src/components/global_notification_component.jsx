import React, { useEffect, useState } from 'react';

const Global_notification_component = ({ message, type = 'info', duration = 3000 }) => {
    const [visible, setVisible] = useState(!!message);
    const [offsetTop, setOffsetTop] = useState('60px'); // Default fallback

    useEffect(() => {
        // Adjust offsetTop for small screens
        const updateOffset = () => {
            const isMobile = window.innerWidth <= 768;
            setOffsetTop(isMobile ? '80px' : '40px');
        };

        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, []);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [message, duration]);

    if (!visible || !message) return null;

    const typeStyles = {
        success: { background: '#28a745', icon: '✅' },
        error: { background: '#FF3B30', icon: '⚠️' },
        info: { background: '#17a2b8', icon: 'ℹ️' },
    };

    const { background, icon } = typeStyles[type] || typeStyles.info;

    return (
        <div
            style={{
                position: 'fixed',
                top: `calc(env(safe-area-inset-top, 0px) + ${offsetTop})`,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: background,
                color: '#fff',
                padding: '12px 18px',
                borderRadius: '8px',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                fontSize: '16px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                maxWidth: '90vw',
                wordWrap: 'break-word',
                textAlign: 'center',
            }}
        >
            <span>{icon}</span>
            <span>{message}</span>
        </div>
    );
};

export default Global_notification_component;