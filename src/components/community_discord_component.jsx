import React from 'react';

const Community_discord_component = () => {
    return (
        <section className="py-12 text-center bg-gray-900">
            <h2 className="text-4xl font-bold text-red-500 mb-8">💬 Join the Discussion</h2>

            <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
                <iframe
                    src="https://discord.com/widget?id=826494441413148682&theme=dark"
                    width="100%"
                    height="400"
                    allowTransparency="true"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    title="Discord Widget"
                ></iframe>
            </div>
        </section>
    );
};

export default Community_discord_component;