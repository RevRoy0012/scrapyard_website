import React, { useEffect } from 'react';
import 'animate.css';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';
import Video from './components/Video';

function App() {
    useEffect(() => {
        window.scrollTo(0, 1);
    }, []);

    return (
        <div className="bg-black text-white">
            <HeroSection />
            <WhoWeAre />
            <OurTeam />
            <EventsPage />
            <BlogPost />
            <Video />
        </div>
    );
}

export default App;
