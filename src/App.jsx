import React from 'react';
import 'animate.css';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';

function App() {
    return (
        <div className="bg-black text-white">
            <HeroSection />
            <WhoWeAre />
            <OurTeam />
        </div>
    );
}

export default App;
