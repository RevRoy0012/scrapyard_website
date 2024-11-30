import React from 'react';

const WhoWeAre = () => {
    return (
        <section
            className="py-16 px-8 text-center bg-cover bg-center relative"
            style={{ backgroundImage: 'url(/small.png)' }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for better text visibility */}
            <div className="relative z-10">
                <h2 className="text-5xl text-white font-bold mb-4">
                    Who We Are
                </h2>
                <p className="text-xl text-white mt-4 max-w-3xl mx-auto leading-relaxed">
                    ScrapYard is a Discord community featuring a work-in-progress, unique car economy and management game bot, along with an iRacing simracing team. Our goal is to bring together communities through positive interactions and the power of simracing for good. We race, we thrive in a competitive environment, we battle, but most of all, we share the love with others, while learning to become better drivers along the way.
                </p>
                <p className="text-xl text-white mt-4 max-w-3xl mx-auto leading-relaxed">
                    The ScrapYard Game is a work-in-progress game run through Discord. Pick a car from the scrapyard, repair it, customize it to fit its purpose, and bet against other players in races. ScrapYard has its own economy system and a wide selection of cars to choose from. Your dream car is just a few commands away.
                </p>
            </div>
        </section>
    );
};

export default WhoWeAre;
