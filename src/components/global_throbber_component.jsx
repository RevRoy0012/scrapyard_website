import React from 'react';

const Global_throbber_component = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '8px solid #f3f3f3',
                borderTop: '8px solid #ff0000',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Global_throbber_component;