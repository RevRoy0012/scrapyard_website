import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/metrics/public";

const Main_live_stats_component = () => {
    const [stats, setStats] = useState({
        highestEarner: { username: "N/A", credits: 0 },
        totalUsers: 0,
        ongoingAuctions: 0,
        totalCars: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch live stats:", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-16 px-8 text-center bg-black">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-bold text-white mb-10">Live ScrapYard Stats</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Highest Earner */}
                    <motion.div
                        className="bg-gray-900 p-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl text-red-500 font-semibold">💰 Highest Earner</h3>
                        <p className="text-white text-xl mt-2">{stats.highestEarner.username}</p>
                        <p className="text-green-400 text-3xl font-bold">{stats.highestEarner.credits} Credits</p>
                    </motion.div>

                    {/* Total Users */}
                    <motion.div
                        className="bg-gray-900 p-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <h3 className="text-2xl text-red-500 font-semibold">👥 Total Users</h3>
                        <p className="text-white text-4xl font-bold mt-2">{stats.totalUsers}</p>
                    </motion.div>

                    {/* Ongoing Auctions */}
                    <motion.div
                        className="bg-gray-900 p-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h3 className="text-2xl text-red-500 font-semibold">📢 Ongoing Auctions</h3>
                        <p className="text-white text-4xl font-bold mt-2">{stats.ongoingAuctions}</p>
                    </motion.div>

                    {/* Total Cars */}
                    <motion.div
                        className="bg-gray-900 p-6 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h3 className="text-2xl text-red-500 font-semibold">🚗 Total Cars</h3>
                        <p className="text-white text-4xl font-bold mt-2">{stats.totalCars}</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Main_live_stats_component;