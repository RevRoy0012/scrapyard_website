// src/EasterEggListener.jsx
import React, { useState, useEffect, useRef } from 'react';
import EasterEggGame from './components/EasterEggGame.jsx';

const EasterEggListener = () => {
    const [showGame, setShowGame] = useState(false);
    const keyBuffer = useRef('');
    const mobileTapCount = useRef(0);
    const mobileTapTimeout = useRef(null);

    // Trigger the game only if it hasn't been attempted already
    const triggerGame = () => {
        if (localStorage.getItem("easterEggGameAttempted")) return;
        setShowGame(true);
        keyBuffer.current = '';
        mobileTapCount.current = 0;
    };

    // Desktop trigger: Listen for "scrapyard" typed outside of text inputs
    useEffect(() => {
        const handleKeyDown = (e) => {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
            keyBuffer.current += e.key.toLowerCase();
            if (keyBuffer.current.length > 9) {
                keyBuffer.current = keyBuffer.current.slice(-9);
            }
            if (keyBuffer.current === 'scrapyard') {
                triggerGame();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Mobile trigger: detect 5 taps within 1.5 seconds on a hidden area
    useEffect(() => {
        const handleTouchStart = () => {
            mobileTapCount.current += 1;
            if (mobileTapTimeout.current) {
                clearTimeout(mobileTapTimeout.current);
            }
            mobileTapTimeout.current = setTimeout(() => {
                mobileTapCount.current = 0;
            }, 1500);

            if (mobileTapCount.current >= 5) {
                triggerGame();
            }
        };

        const mobileTriggerArea = document.getElementById('mobile-easter-egg-trigger');
        if (mobileTriggerArea) {
            mobileTriggerArea.addEventListener('touchstart', handleTouchStart);
        }
        return () => {
            if (mobileTriggerArea) {
                mobileTriggerArea.removeEventListener('touchstart', handleTouchStart);
            }
        };
    }, []);

    return (
        <>
            {showGame && <EasterEggGame onClose={() => setShowGame(false)} />}
            {/* Invisible trigger area for mobile users */}
            <div
                id="mobile-easter-egg-trigger"
                style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    opacity: 0,
                    zIndex: 9999,
                }}
            />
        </>
    );
};

export default EasterEggListener;