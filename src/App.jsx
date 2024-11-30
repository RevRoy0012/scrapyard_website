import React from 'react';
import 'animate.css';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';

function App() {
    return (
        <div className="bg-black text-white">
            <HeroSection />
            <WhoWeAre />
            <OurTeam />
            <EventsPage/>
            <BlogPost/>
        </div>
    );
}

export default App;
