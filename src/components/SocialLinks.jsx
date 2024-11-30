import React from 'react';

const SocialLinks = () => {
    return (
        <section className="py-16 bg-red-500 text-center">
            <h2 className="text-4xl text-white">Follow Us</h2>
            <div className="mt-8">
                <a href="https://discord.gg/xmy9vnNEZn" target="_blank" rel="noopener noreferrer" className="text-white mx-4">
                    <i className="fab fa-discord text-2xl"></i> Discord
                </a>

                <a href="https://www.instagram.com/sy_ir_team/" target="_blank" rel="noopener noreferrer" className="text-white mx-4">
                    <i className="fab fa-instagram text-2xl"></i> Instagram
                </a>
            </div>
        </section>
    );
};

export default SocialLinks;
