import React, { useState } from 'react';

const Iracing_team_videos_component = () => {
    const [focusedVideo, setFocusedVideo] = useState(null);

    const handlePlay = (index) => {
        setFocusedVideo(index);
    };

    const handlePause = () => {
        setFocusedVideo(null);
    };

    return (
        <div className="py-12 bg-grey-900 bg-opacity-70 text-white">
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
                        <div
                            key={index}
                            className={`p-4 rounded-lg transform transition-all duration-300 ${
                                focusedVideo === index
                                    ? 'bg-red-600 scale-105 z-10 shadow-xl' 
                                    : 'bg-black bg-opacity-80'
                            }`}
                        >
                            <video
                                className="w-full h-56 sm:h-64 lg:h-72 xl:h-80 rounded-lg"
                                controls
                                src={video.src}
                                onPlay={() => handlePlay(index)}
                                onPause={handlePause}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Iracing_team_videos_component;
