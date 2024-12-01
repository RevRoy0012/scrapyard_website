import React, { useState } from 'react';

const VideosSection = () => {
    const [focusedVideo, setFocusedVideo] = useState(null);

    const handlePlay = (src) => {
        setFocusedVideo(src);
    };

    const handleClose = () => {
        setFocusedVideo(null);
    };

    return (
        <div className="py-12 bg-black bg-opacity-70 text-white">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-8">Gameplay Videos</h2>
                <p className="text-lg text-gray-300 mb-10">Check out some of our exciting gameplay moments!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                    {[
                        { src: '/SY_VIDEO1.mp4', title: 'Video 1' },
                        { src: '/SY_VIDEO2.mp4', title: 'Video 2' },
                        { src: '/SY_VIDEO_3.mp4', title: 'Video 3' },
                        { src: '/SY_VIDEO4.mp4', title: 'Video 4' },
                    ].map((video, index) => (
                        <div key={index} className="p-4 bg-black bg-opacity-80 rounded-lg">
                            <video
                                className="w-full h-56 sm:h-64 lg:h-72 xl:h-80 rounded-lg cursor-pointer"
                                controls
                                src={video.src}
                                onPlay={(e) => {
                                    e.target.pause(); // Prevent video from playing in the grid
                                    handlePlay(video.src);
                                }}
                                style={{ objectFit: 'contain' }} // Ensures no cropping
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Focused Video */}
            {focusedVideo && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white text-2xl font-bold bg-red-500 rounded-full w-10 h-10 flex items-center justify-center z-50"
                        onClick={handleClose}
                    >
                        &times;
                    </button>

                    {/* Video Modal */}
                    <div
                        className="relative bg-black rounded-lg shadow-xl p-4"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside the modal
                        style={{
                            width: '90%',
                            maxWidth: '600px', // Max width for the video container
                            maxHeight: '85vh', // Prevent exceeding viewport height
                            overflow: 'hidden', // Avoid content overflow
                        }}
                    >
                        <video
                            className="rounded-lg"
                            controls
                            autoPlay
                            src={focusedVideo}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain', // Ensures the video fits the player
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideosSection;
