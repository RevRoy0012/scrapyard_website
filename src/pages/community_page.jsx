// eslint-disable-next-line no-unused-vars
import React from 'react';

// Components
import Community_announcements_component from '../components/community_blog_post_component.jsx';
import Community_events_component from '../components/community_events_component.jsx';
import Community_gallery_component from '../components/community_gallery_component.jsx';
import Community_leaderboard_component from '../components/community_leaderboard_component.jsx';
import Community_discord_component from '../components/community_discord_component.jsx';

const Community_page = () => {
    return (
        <div className="bg-gray-900 text-white">
            <main className="pt-20">
                <section className="py-20 px-4">
                    <Community_announcements_component />
                </section>

                <section className="py-20 px-4">
                    <Community_events_component />
                </section>

                <section className="py-20 px-4">
                    <Community_leaderboard_component />
                </section>

                <section className="py-20 px-4 ">
                    <Community_gallery_component />
                </section>

                <section className="py-20 px-4">
                    <Community_discord_component />
                </section>
            </main>
        </div>
    );
};

export default Community_page;