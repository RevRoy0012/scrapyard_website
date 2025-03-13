import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Car Economy Game",
        description: "Find, repair, and customize cars. Compete or trade for profit.",
        icon: "🚗"
    },
    {
        title: "Live Auctions & Dealerships",
        description: "Buy & sell cars through live auctions or manage your own dealership.",
        icon: "💰"
    },
    {
        title: "Mechanic Jobs & Repair Shops",
        description: "Fix cars for others and build your mechanic business.",
        icon: "🛠"
    },
    {
        title: "Tuning & Performance Shops",
        description: "Modify engines, install parts, and create the fastest builds.",
        icon: "🏎"
    },
    {
        title: "Competitive Racing Scene",
        description: "Enter high-stakes races and prove your driving skills.",
        icon: "🏁"
    }
];

const Why_join_scrapyard_component = () => {
    return (
        <section className="relative py-20 px-8 text-center bg-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-bold text-white mb-6">
                    Why Join ScrapYard?
                </h2>

                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    <strong>ScrapYard isn’t just a racing game—it’s an entire economy.</strong>
                    <br></br>
                    Run a dealership, become a top mechanic, flip cars for profit, or race your way to the top!
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-900 p-6 rounded-lg shadow-lg transform transition hover:scale-105"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true }}
                        >
                            <div className="text-5xl">{feature.icon}</div>
                            <h3 className="text-2xl text-red-500 font-semibold mt-4">{feature.title}</h3>
                            <p className="text-gray-300 mt-2">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Why_join_scrapyard_component;