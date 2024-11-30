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
            </div>
        </div>
    );
};

export default HeroSection;
