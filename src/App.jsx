import React from 'react';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import SocialLinks from './components/SocialLinks';

function App() {
    return (
        <div className="bg-black text-white">
            <HeroSection />
            <WhoWeAre />
            <OurTeam />
            <SocialLinks />
        </div>
    );
}

export default App;
