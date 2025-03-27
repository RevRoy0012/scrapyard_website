import React from 'react';

const Iracing_team_component = () => {
    const teamMembers = [
        { name: 'Jordan', role: 'Team Lead', image: '/weewoo_pfp.webp' },
        { name: 'Alex', role: 'Livery Artist', image: '/alex.webp' },
        { name: 'Nathan', role: 'Driver', image: '/jae_pfp.webp' },
        { name: 'Malvyn', role: 'Driver', image: '/mel_pfp.webp' },
        { name: 'Michael', role: 'Jr. Driver', image: '/subie_pfp.webp' },
        { name: 'Jrodt', role: 'Jr Driver', image: '/jrodt.webp' },
        { name: 'Aaron', role: 'Associate', image: '/ben_pfp.webp' }
    ];

    return (
        <section className="py-16 bg-gray-900 text-center" id="team">
            <h2 className="text-red-500 text-5xl font-bold mb-10">Meet Our Team</h2>
            <div className="flex flex-wrap justify-center mt-8">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-gray-800  mx-4 my-6 transform transition-transform duration-300 hover:scale-105"
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
