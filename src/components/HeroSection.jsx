import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [scrolling, setScrolling] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 10) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(../../big.png)' }}>
            <div className={`absolute inset-0 ${scrolling ? 'bg-black opacity-70' : 'bg-black opacity-50'} transition-opacity duration-500`}></div>

            {/* Parallax Effect */}
            <div
                className={`relative z-10 flex flex-col items-center justify-center h-full text-center transition-all duration-500 transform ${scrolling ? 'scale-95' : ''}`}
            >
                <h1 className="text-5xl font-bold text-red-500 animate__animated animate__fadeIn animate__delay-1s">
                    Welcome to ScrapYard
                </h1>
                <p className="text-xl text-white mt-4 animate__animated animate__fadeIn animate__delay-1s">
                    Join us for the best car community experience
                </p>

                {/* Social Media Buttons with Fade In */}
                <div className="flex justify-center mt-8 space-x-6 animate__animated animate__fadeIn animate__delay-2s">
                    <a
                        href="https://discord.gg/xmy9vnNEZn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-transparent border-2 border-white p-6 rounded-full transform transition-transform duration-300 hover:scale-110"
                    >
                        <i className="fab fa-discord text-3xl"></i>
                    </a>

                    <a
                        href="https://www.instagram.com/sy_ir_team/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-transparent border-2 border-white p-6 rounded-full transform transition-transform duration-300 hover:scale-110"
                    >
                        <i className="fab fa-instagram text-3xl"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
