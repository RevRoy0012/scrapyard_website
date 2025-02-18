// src/App.js
import React, { useEffect, useState } from 'react';
import 'animate.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Spinner from './components/Spinner';

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
import BugReport from "./pages/BugReport";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 1);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${parsedUser.email}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        const updatedUser = { ...parsedUser, ...data };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        setLoggedIn(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching fresh user data:", error);
                        setUser(parsedUser);
                        setLoggedIn(true);
                    })
                    .finally(() => setLoadingUser(false));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                setLoadingUser(false);
            }
        } else {
            setLoadingUser(false);
        }
    }, []);

    // We no longer block the main page based on loadingUser
    // Instead, routes that require a user will check accordingly.

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
                            <Login onLoginSuccess={() => {
                                setLoggedIn(true);
                                const storedUser = localStorage.getItem('user');
                                if (storedUser) setUser(JSON.parse(storedUser));
                            }} />
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
                    element={loggedIn ? <Profile onLogout={() => { setLoggedIn(false); setUser(null); }} /> : <Navigate to="/login" replace />}
                />

                <Route path="/discord-success" element={<DiscordSuccess />} />

                <Route path="/bug-report" element={<BugReport />} />

                {/* Handle unknown routes */}
                <Route path="*" element={<div style={{ color: '#fff', padding: '20px' }}>Page Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;