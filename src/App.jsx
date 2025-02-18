// src/App.js
import React, { useEffect, useState } from 'react';
import 'animate.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HeroSection from './components/HeroSection';
import WhoWeAre from './components/WhoWeAre';
import OurTeam from './components/OurTeam';
import EventsPage from './components/EventsPage';
import BlogPost from './components/BlogPost';
import Video from './components/Video';
import Sponsors from './components/Sponsors';

import Login from './pages/SignIn.jsx';
import SignUp from './pages/SignUp';
import LinkDiscord from './pages/LinkDiscord';
import DiscordCallback from './pages/DiscordCallback';
import Profile from './pages/Profile';
import DiscordSuccess from "./pages/DiscordSuccess.jsx";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 1);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setLoggedIn(true);
            setUser(JSON.parse(storedUser));
        } else {
            setLoggedIn(false);
            setUser(null);
        }
    }, []);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUser(null);
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
                    element={
                        loggedIn
                            ? (user && user.discord_linked
                                ? <Navigate to="/profile" replace />
                                : <LinkDiscord />)
                            : <Navigate to="/login" replace />
                    }
                />

                {/* OAuth Callback Route from Discord */}
                <Route path="/oauth2/callback" element={<DiscordCallback />} />

                {/* Profile Page Route */}
                <Route
                    path="/profile"
                    element={loggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" replace />}
                />

                {/* Discord Success Page */}
                <Route
                    path="/discord-success"
                    element={<DiscordSuccess />}
                />

                {/* Handle unknown routes */}
                <Route path="*" element={<div style={{ color: '#fff', padding: '20px' }}>Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;