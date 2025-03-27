// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// Components
import Main_hero_component from './components/main_hero_component.jsx';
import Main_who_we_are_component from './components/main_who_we_are_component.jsx';
import Main_why_join_scrapyard_component from "./components/main_why_join_scrapyard_component.jsx";
import Main_how_it_works_component from './components/main_how_it_works_component.jsx';
import Main_live_stats_component from './components/main_live_stats_component.jsx';
import Main_final_cta_component from "./components/main_final_cta_component.jsx";
import Global_navigation_component from './components/global_navigation_component.jsx';
import Global_progress_bar_component from './components/global_progress_bar_component.jsx';
import Global_page_transition_wrapper_component from './components/global_page_transition_wrapper.jsx';

// Pages
import Community_page from './pages/community_page.jsx';
import Iracing_team_page from './pages/iracing_team_page.jsx';
import Link_tree_page from './pages/link_tree_page.jsx';
import User_sign_in_page from './pages/user_sign_in_page.jsx';
import User_sign_up_page from './pages/user_sign_up_page.jsx';
import Link_discord_page from './pages/link_discord_page.jsx';
import Discord_callback_page from './pages/discord_callback_page.jsx';
import User_profile_page from './pages/user_profile_page.jsx';
import Discord_success_page from "./pages/discord_success_page.jsx";
import Bug_report_page from "./pages/bug_report_page.jsx";

// EasterEggListener
import X47TriggerJsx from './X47Trigger.jsx.jsx';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    window.scrollTo(0, 1);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                fetch(`https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/profile?email=${parsedUser.email}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const updatedUser = { ...parsedUser, ...data };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        setLoggedIn(true);
                    })
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }
    }, []);

    return (
        <Router>
            <Global_progress_bar_component />
            <Global_navigation_component />
            <Suspense fallback={<Global_progress_bar_component />}>
                <Global_page_transition_wrapper_component>
                    <Routes>
                        {/* Main Page */}
                        <Route
                            path="/"
                            element={
                                <div>
                                    <Main_hero_component />
                                    <Main_who_we_are_component />
                                    <Main_why_join_scrapyard_component />
                                    <Main_how_it_works_component />
                                    <Main_live_stats_component />
                                    <Main_final_cta_component />
                                </div>
                            }
                        />

                        {/* Community Page */}
                        <Route path="/community" element={<Community_page />} />

                        {/* iRacing Team Page */}
                        <Route path="/iracing" element={<Iracing_team_page />} />

                        {/* Link Tree Page */}
                        <Route path="/links" element={<Link_tree_page />} />

                        {/* Authentication Pages */}
                        <Route
                            path="/login"
                            element={
                                loggedIn ? (
                                    <Navigate to="/link-discord" replace />
                                ) : (
                                    <User_sign_in_page onLoginSuccess={() => {
                                        setLoggedIn(true);
                                        const storedUser = localStorage.getItem('user');
                                        if (storedUser) setUser(JSON.parse(storedUser));
                                    }} />
                                )
                            }
                        />
                        <Route
                            path="/signup"
                            element={loggedIn ? <Navigate to="/link-discord" replace /> : <User_sign_up_page />}
                        />
                        <Route
                            path="/link-discord"
                            element={
                                loggedIn
                                    ? (user && user.discord_linked
                                        ? <Navigate to="/profile" replace />
                                        : <Link_discord_page />)
                                    : <Navigate to="/login" replace />
                            }
                        />
                        <Route
                            path="/Home"
                            element={ <Navigate to="/" replace /> }>
                        </Route>

                        {/* Other Routes */}
                        <Route path="/oauth2/callback" element={<Discord_callback_page />} />
                        <Route
                            path="/profile"
                            element={loggedIn ? <User_profile_page onLogout={() => { setLoggedIn(false); setUser(null); }} /> : <Navigate to="/login" replace />}
                        />
                        <Route path="/discord-success" element={<Discord_success_page />} />
                        <Route path="/bug-report" element={<Bug_report_page />} />
                        <Route path="*" element={<div className="text-white p-20 text-center">404 - Page Not Found</div>} />
                    </Routes>

                    <X47TriggerJsx />
                </Global_page_transition_wrapper_component>
            </Suspense>
        </Router>
    );
}

export default App;