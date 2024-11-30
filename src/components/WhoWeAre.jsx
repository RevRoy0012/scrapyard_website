import React from 'react';

const WhoWeAre = () => {
    return (
        <section
            className="py-16 px-8 text-center bg-cover bg-center relative"
            style={{ backgroundImage: 'url(/small.png)' }} // Add your image here
        >
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for better text visibility */}
            <div className="relative z-10">
                <h2 className="text-5xl text-white font-bold mb-4">
                    Who We Are
                </h2>
                <p className="text-xl text-white mt-4 max-w-3xl mx-auto leading-relaxed">
                    ScrapYard is a community-driven car game and iRacing team. We race, we compete, and we thrive in a competitive environment, all while having fun with our friends and community!
                </p>
            </div>
        </section>
    );
};

export default WhoWeAre;
