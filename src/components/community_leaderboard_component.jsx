import React, { useState, useEffect } from 'react';

const API_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/metrics/public/leaderboard";

const rankColors = ["from-yellow-400 to-yellow-600", "from-gray-300 to-gray-500", "from-orange-400 to-orange-600"];

const Community_leaderboard_component = () => {
    const [leaders, setLeaders] = useState({ highestEarners: [], topRacers: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Failed to fetch leaderboard data.");
                const data = await response.json();
                setLeaders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.username) setCurrentUsername(parsed.username);
            } catch (err) {
                console.error("Failed to parse user from localStorage.");
            }
        }

        fetchLeaderboard();
    }, []);

    const renderCard = (user, index, type = "earnings") => {
        const isTopThree = index < 3;
        const rankBg = isTopThree ? rankColors[index] : "from-gray-800 to-gray-900";
        const formattedValue = type === "earnings" ? `${user.credits} Credits` : `${user.racesWon} Wins`;
        const isCurrentUser = user.username === currentUsername;

        return (
            <div
                key={`${user.username}-${index}`}
                className={`relative bg-gradient-to-br ${rankBg} rounded-xl p-6 shadow-lg transition-transform transform hover:scale-105`}
            >
                {/* "You" Badge */}
                {isCurrentUser && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10">
                        You!!
                    </div>
                )}

                {/* Rank */}
                <div className="text-3xl font-black text-white mb-2">
                    #{index + 1}
                </div>

                {/* Username */}
                <div className="text-xl text-white font-semibold mb-1">
                    {user.username}
                </div>

                {/* Value */}
                <div className="text-md text-gray-200 italic">{formattedValue}</div>
            </div>
        );
    };

    return (
        <section className="text-center bg-gray-900 py-20 px-4">
            <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">🏆 Leaderboard</h2>
            <p className="text-gray-400 mb-10">Compete for credits, respect, and ultimate flex.</p>

            {loading ? (
                <p className="text-white">Loading leaderboard...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="max-w-6xl mx-auto">
                    {/* Highest Earners */}
                    <h3 className="text-2xl text-red-500 font-bold mb-4">💰 Top Earners</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                        {leaders.highestEarners.map((user, index) =>
                            renderCard(user, index, "earnings")
                        )}
                    </div>

                    {/* Top Racers */}
                    <h3 className="text-2xl text-orange-500 font-bold mb-4">🏁 Top Racers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {leaders.topRacers.map((user, index) =>
                            renderCard(user, index, "races")
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Community_leaderboard_component;