import React, { useEffect, useState } from 'react';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/event');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data.events);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        if (!events.length) return;

        const currentTime = Date.now();
        const nextEvent = events
            .map((event) => ({
                ...event,
                date_start: new Date(event.date_start).getTime(),
            }))
            .filter((event) => event.date_start > currentTime)
            .sort((a, b) => a.date_start - b.date_start)[0];

        if (!nextEvent) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const timeLeft = nextEvent.date_start - now;

            if (timeLeft <= 0) {
                clearInterval(interval);
                setCountdown('Event is starting now!');
            } else {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                // Build countdown string, omitting parts that are 0
                let countdownString = '';
                if (days > 0) countdownString += `${days}d `;
                if (hours > 0) countdownString += `${hours}h `;
                if (minutes > 0) countdownString += `${minutes}m `;
                countdownString += `${seconds}s`;

                setCountdown(countdownString);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [events]);

    if (loading) {
        return <div className="text-center py-10 text-white">Loading events...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const currentTime = Date.now();

    const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.date_start).getTime();
        return eventStartTime >= currentTime;
    });

    const liveEvents = events.filter((event) => {
        const eventStartTime = new Date(event.date_start).getTime();
        const eventEndTime = new Date(event.date_end).getTime();
        return eventStartTime <= currentTime && eventEndTime >= currentTime;
    });

    return (
        <div className="bg-cover bg-center min-h-screen py-12" style={{ backgroundImage: 'url(/medium.png)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Events Happening Now */}
                {liveEvents.length > 0 && (
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Events Happening Now</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {liveEvents.map((event) => {
                                return (
                                    <div
                                        key={event.id}
                                        className="relative p-6 rounded-lg shadow-lg bg-black bg-opacity-60 event-glowing-outline"
                                    >
                                        {/* LIVE Tag */}
                                        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-sm font-bold py-1 px-3 rounded-full shadow-md">
                                            LIVE
                                        </div>

                                        <h2 className="text-2xl font-semibold text-white mb-3">{event.title}</h2>

                                        <div className="mb-4">
                                            <span className="font-medium text-gray-300">Description: </span>
                                            <p className="text-gray-200">{event.content}</p>
                                        </div>

                                        <div className="mb-4">
                                            <span className="font-medium text-gray-300">Start Date & Time: </span>
                                            <span className="text-gray-200">{formatDateTime(event.date_start)}</span>
                                        </div>

                                        <div className="mb-4">
                                            <span className="font-medium text-gray-300">End Date & Time: </span>
                                            <span className="text-gray-200">{formatDateTime(event.date_end)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <h1 className="text-4xl font-extrabold text-center text-red-500 mb-10">Upcoming Events</h1>

                {countdown && (
                    <div className="bg-black bg-opacity-60 text-white p-6 rounded-lg shadow-lg mb-8">
                        <p className="text-center text-2xl font-semibold text-red-500">Next Event Starts In:</p>
                        <p className="text-center text-xl text-white mt-2">{countdown}</p>
                    </div>
                )}

                {/* Other Upcoming Events */}
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => {
                            return (
                                <div
                                    key={event.id}
                                    className="p-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out bg-black bg-opacity-60"
                                >
                                    <h2 className="text-2xl font-semibold text-red-500 mb-3">{event.title}</h2>

                                    <div className="mb-4">
                                        <span className="font-medium text-gray-300">Description: </span>
                                        <p className="text-gray-200">{event.content}</p>
                                    </div>

                                    <div className="mb-4">
                                        <span className="font-medium text-gray-300">Start Date & Time: </span>
                                        <span className="text-gray-200">{formatDateTime(event.date_start)}</span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="font-medium text-gray-300">End Date & Time: </span>
                                        <span className="text-gray-200">{formatDateTime(event.date_end)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-black bg-opacity-60 text-white p-6 rounded-lg shadow-lg flex justify-center items-center h-56">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-red-500">No upcoming events planned</p>
                            <p className="text-lg text-gray-200 mt-2">Check back later for new events!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
