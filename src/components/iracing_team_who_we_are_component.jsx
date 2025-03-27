import React from 'react';

const Iracing_team_who_we_are = () => {
    return (
        <section
            className="py-16 px-8 text-center bg-cover bg-center relative"
        >
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div> {/* Overlay for better text visibility */}
            <div className="relative z-10">
                <h2 className="text-red-500 text-5xl font-bold mb-10">
                    Who We Are
                </h2>
                <p className="text-xl text-white mt-4 max-w-3xl mx-auto leading-relaxed">
                    ScrapYard iRacing is a SY based group of skilled sim racers. Our goal is to bring together communities through positive interactions and the power of simracing for good. We race, we thrive in a competitive environment, we battle, but most of all, we share the love with others, while learning to become better drivers along the way.
                </p>
            </div>
        </section>
    );
};

export default Iracing_team_who_we_are;
