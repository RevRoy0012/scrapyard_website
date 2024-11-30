import React from 'react';

const OurTeam = () => {
    const teamMembers = [
        { name: 'weewoo', role: 'SY IR Team Lead', image: '../../weewoo_pfp.png' },
        { name: 'Roy', role: 'Developer & Jr. Driver', image: '../../roy_pfp.png' },
        { name: 'ben', role: 'Driver', image: '../../ben_pfp.png' },
        { name: 'Jae', role:'Driver', image: '../../jae_pfp.png' },
        { name: 'Mel', role:'Driver', image: '../../mel_pfp.png' },
        { name: 'Subie', role:' Jr. Driver', image: '../../subie_pfp.png' },
    ];

    return (
        <section className="py-16 bg-black text-center">
            <h2 className="text-4xl text-white">Meet Our Team</h2>
            <div className="flex flex-wrap justify-center mt-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="max-w-xs mx-4 my-4">
                        <img src={member.image} alt={member.name} className="rounded-full w-40 h-40 object-cover mx-auto" />
                        <h3 className="text-xl text-white mt-4">{member.name}</h3>
                        <p className="text-white">{member.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurTeam;
