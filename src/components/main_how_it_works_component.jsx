import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
    {
        title: "Find & Buy Cars",
        description: "Search the scrapyard for hidden gems or bid in live auctions.",
        icon: "🚗"
    },
    {
        title: "Repair & Upgrade",
        description: "Fix your car and install performance upgrades or customizations.",
        icon: "🛠"
    },
    {
        title: "Start Your Business",
        description: "Become a mechanic, own a dealership, or run a tuning shop.",
        icon: "🏢"
    },
    {
        title: "Race & Trade",
        description: "Compete in high-stakes races or flip cars for profit in the marketplace.",
        icon: "🏎"
    }
];

const How_it_works_component = () => {
    return (
        <section className="relative py-20 px-8 text-center bg-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-bold text-white mb-10">
                    How ScrapYard Works
                </h2>

                {/* Step-by-Step Guide */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
                    {steps.map((step, index) => {
                        const { ref, inView } = useInView({
                            triggerOnce: true,
                            threshold: 0.3
                        });

                        return (
                            <motion.div
                                ref={ref}
                                key={index}
                                className="bg-gray-900 p-6 rounded-lg shadow-lg transform transition hover:scale-105"
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
                            >
                                <div className="text-5xl">{step.icon}</div>
                                <h3 className="text-2xl text-red-500 font-semibold mt-4">{step.title}</h3>
                                <p className="text-gray-300 mt-2">{step.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default How_it_works_component;