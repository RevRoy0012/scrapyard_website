// src/EasterEggGame.jsx
import React, { useState, useEffect } from 'react';

const TARGET_SIZE = 60; // Increased for improved visibility
const GAME_TIME = 13; // Total game time in seconds
const WIN_SCORE = 15; // Number of clicks required to win
const NAV_BAR_HEIGHT = 60; // Height of the navbar (adjust as needed)

// Computes a random position for the target, ensuring it never appears behind the navbar.
const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (window.innerWidth - TARGET_SIZE));
    const y =
        Math.floor(Math.random() * ((window.innerHeight - TARGET_SIZE) - NAV_BAR_HEIGHT)) +
        NAV_BAR_HEIGHT;
    return { x, y };
};

const EasterEggGame = ({ onClose }) => {
    const [score, setScore] = useState(0);
    const [targetPosition, setTargetPosition] = useState(getRandomPosition());
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [gameOverReason, setGameOverReason] = useState(null); // "misclick" or "timeout"

    // Countdown timer effect: when time runs out, mark game over due to timeout.
    useEffect(() => {
        if (timeLeft <= 0 && !gameOver) {
            setGameOverReason("timeout");
            setGameOver(true);
            return;
        }
        if (gameOver) return;
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, gameOver]);

    // Persist a flag so the game cannot be retried.
    useEffect(() => {
        if (gameOver) {
            localStorage.setItem("easterEggGameAttempted", "true");
        }
    }, [gameOver]);

    // Handle a correct click on the target.
    const handleTargetClick = (e) => {
        e.stopPropagation(); // Prevent misclick detection.
        const newScore = score + 1;
        setScore(newScore);
        if (newScore >= WIN_SCORE) {
            setWin(true);
            setGameOver(true);
        } else {
            setTargetPosition(getRandomPosition());
        }
    };

    // Handle misclicks (clicks outside the target).
    const handleMisclick = () => {
        if (!gameOver) {
            setGameOverReason("misclick");
            setGameOver(true);
        }
    };

    // Close the game modal.
    const handleClose = () => {
        onClose();
    };

    return (
        <div
            onClick={handleMisclick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
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
                        ScrapYard Challenge
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
                        Hit the hexagonal target <strong>five times</strong> without missing.
                        One misclick and the challenge is over!
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
                            top: targetPosition.y,
                            left: targetPosition.x,
                            width: TARGET_SIZE,
                            height: TARGET_SIZE,
                            backgroundColor: '#FF3B30',
                            clipPath:
                                'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                            cursor: 'pointer',
                            transition: 'top 0.3s, left 0.3s',
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
                                Take a screenshot of this screen and send it via Discord to claim
                                your rewards!
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
                            {gameOverReason === 'misclick' ? (
                                <p
                                    style={{
                                        fontFamily: 'Roboto, sans-serif',
                                        fontSize: '18px',
                                        color: '#FFFFFF',
                                        marginBottom: '30px',
                                    }}
                                >
                                    You misclicked! You can no longer attempt the game.
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
                                    Time's up! You can no longer attempt the game.
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

export default EasterEggGame;