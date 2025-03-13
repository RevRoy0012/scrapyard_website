import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
    {
        title: "Car Economy Game",
        description: "Find, repair, and customize cars. Buy, sell, and compete in races.",
        icon: "🚗"
    },
    {
        title: "Live Auctions",
        description: "Bid on rare and unique cars in real-time. Make your fortune in the marketplace.",
        icon: "💰"
    },
    {
        title: "Customization & Tuning",
        description: "Upgrade your cars with parts, custom paint jobs, and performance tuning.",
        icon: "🛠"
    },
    {
        title: "Race & Compete",
        description: "Take your cars to the track and battle others for the top spot.",
        icon: "🏎"
    }
];

const Main_who_we_are_component = () => {
    // Track if the section is in view
    const { ref, inView } = useInView({
        triggerOnce: true,  // Only animate once
        threshold: 0.2      // Start animation when 20% of the section is visible
    });

    return (
        <section ref={ref} className="relative py-20 px-8 text-center bg-cover bg-center">
            {/* Background Video */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10">
                <source src="/SY_VIDEO1.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Animate Title when in view */}
                <motion.h2
                    className="text-5xl font-bold text-white mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    What is ScrapYard?
                </motion.h2>

                <motion.p
                    className="text-xl text-white max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                >
                    <strong>ScrapYard is a car economy and racing game powered by our custom Discord bot and app.</strong>
                    <br></br>
                    Find old cars, restore them, and battle against other players to prove who has the best ride.
                </motion.p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-900 p-6 rounded-lg shadow-lg transform transition hover:scale-105"
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 + index * 0.2, duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="text-5xl">{feature.icon}</div>
                            <h3 className="text-2xl text-red-500 font-semibold mt-4">{feature.title}</h3>
                            <p className="text-gray-300 mt-2">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Interactive Try It Now Section */}
                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                >
                </motion.div>
            </div>
        </section>
    );
};

export default Main_who_we_are_component;