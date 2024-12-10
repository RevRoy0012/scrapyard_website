import React, { useEffect } from 'react';
import 'animate.css';
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';
import Video from './components/Video';
import OAuthCallback from './pages/OAuthCallback';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    useEffect(() => {
        window.scrollTo(0, 1);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Main page routes */}
                <Route
                    path="/"
                    element={
                        <div className="bg-black text-white">
                            <HeroSection />
                            <WhoWeAre />
                            <OurTeam />
                            <EventsPage />
                            <BlogPost />
                            <Video />
                        </div>
                    }
                />
                {/* OAuth callback route */}
                <Route path="/oauth2/callback" element={<OAuthCallback />} />
            </Routes>
        </Router>
    );
}

export default App;