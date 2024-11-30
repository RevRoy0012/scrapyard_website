import React, { useEffect, useState } from 'react';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch events from the API
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/event'); // Replace with your actual API URL
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

    if (loading) {
        return <div className="text-center py-10 text-white">Loading events...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    // Helper function to format date and time to local machine timezone
    const formatDateTime = (dateString) => {
        const date = new Date(dateString); // Converts UTC to local timezone automatically
        return date.toLocaleString(); // Formats the date and time in the user's local timezone
    };

    // Get current time and filter out past events
    const currentTime = Date.now();

    const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.date_start).getTime();
        return eventStartTime >= currentTime; // Only keep events that are in the future
    });

    return (
        <div className="bg-cover bg-center min-h-screen py-12" style={{ backgroundImage: 'url(/medium.png)' }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-red-500 mb-10">Upcoming Events</h1>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="bg-black bg-opacity-60 text-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
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
                        ))}
                    </div>
                ) : (
                    // If no upcoming events, show this message
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
