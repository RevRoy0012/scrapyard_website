import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Main_hero_component = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <motion.div
                    className="max-w-4xl space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
                    >
                        Build. Race. Dominate.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Buy, restore, and customize cars. Compete in races.
                        <br></br>
                        <strong>Build your empire in the ultimate car economy platform.</strong>
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col md:flex-row gap-4 justify-center mt-8"
                    >
                        <motion.a
                            href="https://discord.gg/xmy9vnNEZn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join Discord Community
                        </motion.a>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/development"
                                className="block bg-transparent border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full text-lg font-medium transition-all"
                            >
                                Explore Features
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Animated scrolling indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <div className="w-8 h-8 border-b-2 border-r-2 border-white rotate-45"></div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Main_hero_component;