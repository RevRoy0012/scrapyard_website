import React, { useState, useEffect } from 'react';

const TARGET_SIZE = 60;
const GAME_TIME = 16;
const WIN_SCORE = 15;
const NAV_OFFSET_VH = 10;
const LS_KEY = "x47_flag";

// Compute a random position using viewport units so it scales with zoom.
const getRandomPosition = () => {
    const left = Math.random() * 80; // between 0 and 80vw
    const top = NAV_OFFSET_VH + Math.random() * (90 - NAV_OFFSET_VH); // between 10vh and 90vh
    return { left: `${left}vw`, top: `${top}vh` };
};

const X47Challenge = ({ onClose }) => {
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState(getRandomPosition());
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [reason, setReason] = useState(null); // 'misclick' or 'timeout'

    // Countdown timer effect – when time runs out, end game with "timeout"
    useEffect(() => {
        if (timeLeft <= 0 && !gameOver) {
            setReason("timeout");
            setGameOver(true);
            return;
        }
        if (gameOver) return;
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, gameOver]);

    // Once the challenge is over, persist the flag to prevent reattempts.
    useEffect(() => {
        if (gameOver) {
            localStorage.setItem(LS_KEY, "true");
        }
    }, [gameOver]);

    // Handle a valid target hit.
    const handleTargetClick = (e) => {
        e.stopPropagation();
        const newScore = score + 1;
        setScore(newScore);
        if (newScore >= WIN_SCORE) {
            setWin(true);
            setGameOver(true);
        } else {
            setPosition(getRandomPosition());
        }
    };

    // A misclick (any click outside the target) immediately ends the challenge.
    const handleMisclick = () => {
        if (!gameOver) {
            setReason("misclick");
            setGameOver(true);
        }
    };

    const handleClose = () => onClose();

    return (
        <div
            onClick={handleMisclick}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(135deg, #0A0A0A, #121212)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
                boxSizing: 'border-box',
            }}
        >
            {!gameOver ? (
                <>
                    <h1
                        style={{
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '48px',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #FF3B30, #FF9500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '20px',
                        }}
                    >
                        X47 Challenge
                    </h1>
                    <p
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '18px',
                            color: '#FFFFFF',
                            marginBottom: '30px',
                            textAlign: 'center',
                            maxWidth: '600px',
                        }}
                    >
                        Hit the hexagonal target <strong>five times</strong> without a misclick.
                        One error and the challenge is over!
                    </p>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '400px',
                            padding: '10px 20px',
                            marginBottom: '20px',
                            backgroundColor: '#2D2D2D',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        }}
                    >
            <span
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '16px',
                    color: '#FFFFFF',
                }}
            >
              Score: {score} / {WIN_SCORE} | Time Left: {timeLeft}s
            </span>
                    </div>
                    <div
                        onClick={handleTargetClick}
                        style={{
                            position: 'absolute',
                            left: position.left,
                            top: position.top,
                            width: TARGET_SIZE,
                            height: TARGET_SIZE,
                            backgroundColor: '#FF3B30',
                            clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                            cursor: 'pointer',
                            transition: 'left 0.3s, top 0.3s',
                            boxShadow: '0 0 15px 3px #FF9500',
                        }}
                    />
                </>
            ) : (
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                    {win ? (
                        <>
                            <h1
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '48px',
                                    fontWeight: '700',
                                    background: 'linear-gradient(45deg, #FF3B30, #FF9500)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '20px',
                                }}
                            >
                                Congratulations, You Win!
                            </h1>
                            <p
                                style={{
                                    fontFamily: 'Roboto, sans-serif',
                                    fontSize: '18px',
                                    color: '#FFFFFF',
                                    marginBottom: '30px',
                                }}
                            >
                                Take a screenshot and send it via Discord to claim your rewards!
                            </p>
                        </>
                    ) : (
                        <>
                            <h1
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '48px',
                                    fontWeight: '700',
                                    background: 'linear-gradient(45deg, #FF3B30, #FF9500)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '20px',
                                }}
                            >
                                Game Over
                            </h1>
                            {reason === 'misclick' ? (
                                <p
                                    style={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontSize: '18px',
                                        color: '#FFFFFF',
                                        marginBottom: '30px',
                                    }}
                                >
                                    You misclicked! The challenge is over.
                                </p>
                            ) : (
                                <p
                                    style={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontSize: '18px',
                                        color: '#FFFFFF',
                                        marginBottom: '30px',
                                    }}
                                >
                                    Time's up! The challenge is over.
                                </p>
                            )}
                        </>
                    )}
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #FF3B30, #FF9500)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default X47Challenge;