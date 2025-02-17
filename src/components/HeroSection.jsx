import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [scrolling, setScrolling] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleScroll = () => {
        setScrolling(window.scrollY > 10);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setDropdownOpen(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <div
            className="relative h-screen bg-cover bg-center"
            style={{ backgroundImage: 'url(../../big.png)' }}
        >
            <div
                className={`absolute inset-0 ${
                    scrolling ? 'bg-black opacity-70' : 'bg-black opacity-50'
                } transition-opacity duration-500`}
            ></div>

            <div className="absolute top-0 right-0 m-4 z-20">
                {!isAuthenticated ? (
                    <div className="space-x-2">
                        <Link
                            to="/login"
                            className="bg-transparent text-white px-6 py-3 rounded-full"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-transparent text-white px-6 py-3 rounded-full"
                        >
                            Sign up
                        </Link>
                    </div>
                ) : (
                    <div className="relative inline-block text-left">
                        <button
                            className="flex items-center focus:outline-none"
                            onClick={toggleDropdown}
                        >
                            <img
                                className="w-8 h-8 rounded-full"
                                src={user?.profilePicture || '/default-profile.png'}
                                alt="User"
                            />
                        </button>
                        {dropdownOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/link-discord"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Link Discord
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                className={`relative z-10 flex flex-col items-center justify-center h-full text-center transition-all duration-500 transform ${
                    scrolling ? 'scale-95' : ''
                }`}
            >
                <h1 className="text-5xl font-bold text-red-500 animate__animated animate__fadeIn animate__delay-1s">
                    Welcome to ScrapYard
                </h1>
                <p className="text-xl text-white mt-4 animate__animated animate__fadeIn animate__delay-1s">
                    Join us for the best car community experience
                </p>
                <div className="flex justify-center mt-8 space-x-6 animate__animated animate__fadeIn animate__delay-2s">
                    <a
                        href="https://discord.gg/xmy9vnNEZn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-transparent border-2 border-white p-6 rounded-full transform transition-transform duration-300 hover:scale-110"
                    >
                        <i className="fab fa-discord text-3xl"></i>
                    </a>
                    <a
                        href="https://www.instagram.com/sy_ir_team/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white bg-transparent border-2 border-white p-6 rounded-full transform transition-transform duration-300 hover:scale-110"
                    >
                        <i className="fab fa-instagram text-3xl"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;