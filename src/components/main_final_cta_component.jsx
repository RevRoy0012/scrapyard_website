import React from 'react';
import { motion } from 'framer-motion';

const Main_final_cta_component = () => {
    return (
        <section className="relative py-24 px-8 text-center bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-5xl font-bold text-red-500 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Join ScrapYard Today!
                </motion.h2>

                <motion.p
                    className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                >
                    The ultimate car economy game is waiting for you.
                    <br></br>
                    <strong>Buy, sell, repair, and race your way to the top.</strong>
                    <br></br>
                    Become a part of the <strong>ScrapYard community</strong> today!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <a
                        href="https://discord.gg/scrapyardgg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition"
                    >
                        Join Our Discord
                    </a>
                    <a
                        className="border-2 border-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition"
                    >
                        Download the App (Coming Soon)
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Main_final_cta_component;