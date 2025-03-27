import React, { useState, useEffect, useRef } from 'react';
import X47Challenge from './components/X47Challenge';

const LS_KEY = "x47_flag";
const TRIGGER_SEQ = "0x47";

const X47Trigger = () => {
    const [showChallenge, setShowChallenge] = useState(false);
    const keyBuffer = useRef('');
    const tapCount = useRef(0);
    const tapTimeout = useRef(null);

    // Trigger the challenge if it hasn't been attempted.
    const triggerChallenge = () => {
        if (localStorage.getItem(LS_KEY)) return;
        setShowChallenge(true);
        keyBuffer.current = '';
        tapCount.current = 0;
    };

    // Desktop trigger: Listen for an obfuscated key sequence.
    useEffect(() => {
        const keyHandler = (e) => {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
            keyBuffer.current += e.key.toLowerCase();
            if (keyBuffer.current.length > TRIGGER_SEQ.length) {
                keyBuffer.current = keyBuffer.current.slice(-TRIGGER_SEQ.length);
            }
            if (keyBuffer.current === TRIGGER_SEQ) {
                triggerChallenge();
            }
        };

        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, []);

    // Mobile trigger: Detect 5 rapid taps in an invisible area.
    useEffect(() => {
        const tapHandler = () => {
            tapCount.current += 1;
            if (tapTimeout.current) clearTimeout(tapTimeout.current);
            tapTimeout.current = setTimeout(() => { tapCount.current = 0; }, 1500);
            if (tapCount.current >= 5) triggerChallenge();
        };

        const mobileArea = document.getElementById('mobile-trigger-x47');
        if (mobileArea) mobileArea.addEventListener('touchstart', tapHandler);
        return () => {
            if (mobileArea) mobileArea.removeEventListener('touchstart', tapHandler);
        };
    }, []);

    return (
        <>
            {showChallenge && <X47Challenge onClose={() => setShowChallenge(false)} />}
            <div
                id="mobile-trigger-x47"
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

export default X47Trigger;