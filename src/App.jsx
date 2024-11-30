import React from 'react';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

function App() {
    return (
        <div className="bg-black text-white">
            <HeroSection />
            <WhoWeAre />
            <OurTeam />
            <SocialLinks />
            <Footer />
        </div>
    );
}

export default App;
