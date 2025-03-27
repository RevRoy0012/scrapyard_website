import React from 'react';
import Iracing_team_component from '../components/iracing_team_component.jsx';
import Iracing_team_videos_component from "../components/iracing_team_videos_component.jsx";
import Iracing_team_sponsors_component from "../components/iracing_team_sponsors_component.jsx";
import Iracing_team_who_we_are from "../components/iracing_team_who_we_are_component.jsx";


const Iracing_team_page = () => {
    return (
        <div className=" bg-gray-900 text-white">
            <main className="py-20 px-4">
                <section className="py-20 px-4">
                    <Iracing_team_component />
                </section>

                <section className="py-20 px-4">
                    <Iracing_team_who_we_are />
                </section>

                <section className="py-20 px-4">
                    <Iracing_team_videos_component />
                </section>

                <section className="py-20 px-4">
                    <Iracing_team_sponsors_component />
                </section>
            </main>
        </div>
    );
};

export default Iracing_team_page;