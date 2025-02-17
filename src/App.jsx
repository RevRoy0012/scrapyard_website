// src/App.js
import React, { useEffect, useState } from 'react';
import 'animate.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Dummy components – replace with your actual components
import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';
import Video from './components/Video';
import Sponsors from './components/Sponsors';

// Pages
import Profile from './pages/Profile';
import Login from './pages/SignIn.jsx';
import SignUp from './pages/SignUp';
import LinkDiscord from './pages/LinkDiscord';
import DiscordCallback from './pages/DiscordCallback';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Scroll slightly to trigger any animations
        window.scrollTo(0, 1);

        // Auto-login if user info exists in localStorage
        const user = localStorage.getItem('user');
        if (user) {
            setLoggedIn(true);
        }
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

                {/* Sign Up Page Route */}
                <Route
                    path="/signup"
                    element={loggedIn ? <Navigate to="/link-discord" replace /> : <SignUp />}
                />

                {/* Link Discord Page Route - requires login */}
                <Route
                    path="/link-discord"
                    element={loggedIn ? <LinkDiscord /> : <Navigate to="/login" replace />}
                />

                {/* OAuth Callback Route from Discord */}
                <Route path="/oauth2/callback" element={<DiscordCallback />} />

                {/* Handle unknown routes */}
                <Route
                    path="*"
                    element={<div style={{ color: '#fff', padding: '20px' }}>Page Not Found</div>}
                />
            </Routes>

            <Route
                path="/profile"
                element={loggedIn ? <Profile /> : <Navigate to="/login" replace />}
            />
        </Router>
    );
}

export default App;