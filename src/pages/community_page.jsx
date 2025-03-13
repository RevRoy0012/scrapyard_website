import React from 'react';
import Community_events_component from '../components/community_events_component.jsx';
import Community_blog_post_component from '../components/community_blog_post_component.jsx';

const Community_page = () => {
    return (
        <div className="bg-black text-white">
            <div className="pt-20"> {/* Add padding for navigation */}
                <Community_events_component />
                <Community_blog_post_component />
            </div>
        </div>
    );
};

export default Community_page;