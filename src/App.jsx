import React, { useEffect, useState } from 'react';
import 'animate.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';
import Video from './components/Video';
import Sponsors from './components/Sponsors.jsx';

import Login from './pages/Login';
import LinkDiscord from './pages/LinkDiscord';
import DiscordCallback from './pages/DiscordCallback';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Scroll slightly to trigger any animations
        window.scrollTo(0, 1);

        // Check for JWT in sessionStorage
        const token = sessionStorage.getItem('sy_jwt');
        setLoggedIn(!!token);
    }, []);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
    };

    return (
        <Router>
            <Routes>
                {/* Main Page Route */}
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
                            <Sponsors />
                        </div>
                    }
                />

                {/* Login Page Route */}
                <Route
                    path="/login"
                    element={
                        loggedIn ? (
                            <Navigate to="/link-discord" replace />
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />

                {/* Link Discord Page Route - requires login */}
                <Route
                    path="/link-discord"
                    element={
                        loggedIn ? (
                            <LinkDiscord />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* OAuth Callback Route from Discord */}
                <Route
                    path="/oauth2/callback"
                    element={<DiscordCallback />}
                />

                {/* Add any additional routes or a main-app route here */}
                {/* Example:
                <Route path="/main-app" element={loggedIn ? <MainApp /> : <Navigate to="/login" />} />
                */}

                {/* Handle unknown routes */}
                <Route
                    path="*"
                    element={<div style={{ color: '#fff', padding: '20px' }}>Page Not Found</div>}
                />
            </Routes>
        </Router>
    );
}

export default App;