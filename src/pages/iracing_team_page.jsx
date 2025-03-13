import React from 'react';
import Iracing_team_component from '../components/iracing_team_component.jsx';
import Iracing_team_videos_component from "../components/iracing_team_videos_component.jsx";
import Iracing_team_sponsors_component from "../components/iracing_team_sponsors_component.jsx";

const Iracing_team_page = () => {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="pt-20"> {/* Add padding for navigation */}
                <Iracing_team_component />
                <Iracing_team_videos_component />
                <Iracing_team_sponsors_component />
                <></>
            </div>
        </div>
    );
};

export default Iracing_team_page;