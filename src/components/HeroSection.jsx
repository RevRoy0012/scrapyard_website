import React from 'react';

const HeroSection = () => {
    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(../../big.png)' }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-5xl font-bold text-red-500">Welcome to ScrapYard</h1>
                <p className="text-xl text-white mt-4">Join us for the ultimate racing experience!</p>
            </div>
        </div>
    );
};

export default HeroSection;
