import React from 'react';

const Iracing_team_component = () => {
    const teamMembers = [
        { name: 'Jordan', role: 'Team Lead', image: '/weewoo_pfp.png' },
        { name: 'Aaron', role: 'Driver', image: '/ben_pfp.png' },
        { name: 'Nathan', role: 'Driver', image: '/jae_pfp.png' },
        { name: 'Malvyn', role: 'Driver', image: '/mel_pfp.png' },
        { name: 'Michael', role: 'Jr. Driver', image: '/subie_pfp.png' },
    ];

    return (
        <section className="py-16 bg-black text-center" id="team">
            <h2 className="text-4xl text-white mb-8">Meet Our Team</h2>
            <div className="flex flex-wrap justify-center mt-8">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="max-w-xs mx-4 my-6 transform transition-transform duration-300 hover:scale-105"
                    >
                        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="rounded-full w-40 h-40 object-cover mx-auto border-4 border-red-500 transform transition-transform duration-300 hover:scale-110"
                            />
                            <h3 className="text-xl text-white mt-4">{member.name}</h3>
                            <p className="text-white">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Iracing_team_component;
