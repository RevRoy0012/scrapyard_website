// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const menuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    },
    exit: {
        x: '100%',
        transition: { duration: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
};

const Global_navigation_component = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 10);
            setIsOpen(false);
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleEscape);

        const storedUser = localStorage.getItem('user');
        setIsAuthenticated(!!storedUser);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleMenuClick = (e) => {
        if (e.target === e.currentTarget) {
            setTimeout(() => setIsOpen(false), 200);
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolling ? 'bg-black/90' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo and Brand Name */}
                    <Link to="/" className="flex items-center text-red-500 font-bold text-xl space-x-2">
                        <img src="/sy_logo.png" alt="ScrapYard Logo" className="h-8 w-8" />
                        <span>ScrapYard</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6">
                        {['Community', 'iRacing', 'Links'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="text-white hover:text-red-500 transition-all duration-300"
                            >
                                {item}
                            </Link>
                        ))}

                        {/* Auth Navigation */}
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-white hover:text-red-500 transition-all duration-300">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="text-white hover:text-red-500 transition-all duration-300">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <Link to="/profile" className="text-white hover:text-red-500 transition-all duration-300">
                                Profile
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button with Animated SVG */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white md:hidden focus:outline-none"
                    >
                        <svg
                            className={`w-8 h-8 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {isOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <>
                                    <line x1="4" y1="6" x2="20" y2="6" />
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="18" x2="20" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>

                    {/* Mobile Menu Overlay */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="mobile-menu"
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
                                onClick={handleMenuClick}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="absolute right-0 top-0 h-full w-64 bg-black/95 backdrop-blur-xl shadow-2xl"
                                    variants={menuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="px-6 py-8 h-full flex flex-col">
                                        <motion.button
                                            onClick={() => setIsOpen(false)}
                                            className="self-end mb-8 p-2 hover:bg-white/10 rounded-lg"
                                            variants={itemVariants}
                                        >
                                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </motion.button>

                                        <motion.div className="space-y-4 flex-1">
                                            {['Home','Community', 'iRacing', 'Links'].map((item) => (
                                                <motion.div key={item} variants={itemVariants}>
                                                    <Link
                                                        to={`/${item.toLowerCase()}`}
                                                        className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {item}
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        <motion.div className="pt-4 border-t border-white/10" variants={itemVariants}>
                                            {!isAuthenticated ? (
                                                <>
                                                    <Link to="/login" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg mb-2" onClick={() => setIsOpen(false)}>
                                                        Sign In
                                                    </Link>
                                                    <Link to="/signup" className="block px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg" onClick={() => setIsOpen(false)}>
                                                        Sign Up
                                                    </Link>
                                                </>
                                            ) : (
                                                <Link to="/profile" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsOpen(false)}>
                                                    Profile
                                                </Link>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Global_navigation_component;