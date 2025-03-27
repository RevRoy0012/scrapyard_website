import React from 'react';
import { Link } from 'react-router-dom';

const Link_tree_page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="bg-black/80 backdrop-blur-sm p-8 rounded-2xl max-w-md w-full mx-4 shadow-xl border border-white/10">
                <div className="space-y-8">
                    <div className="text-center">
                        <img
                            src="/sy_logo.png"
                            alt="ScrapYard Logo"
                            className="w-32 h-32 mx-auto mb-4 animate-"
                        />
                        <h1 className="text-4xl font-bold text-red-500">
                            ScrapYard Links
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {/* Main Social Links */}
                        <div className="space-y-4">
                            <h2 className="text-white/80 text-lg font-semibold">Social Connections</h2>
                            <SocialLink href="https://www.patreon.com/c/ScrapYard_GG" icon="fab fa-patreon" label="Official Patreon (Support Us ❤️)" />
                            <SocialLink href="https://discord.com/invite/scrapyardgg" icon="fab fa-discord" label="Official Discord" />
                            <SocialLink href="https://www.youtube.com/@scrapyardgg" icon="fab fa-youtube" label="Official YouTube" />
                            <SocialLink href="https://www.instagram.com/scrapyardgg/" icon="fab fa-instagram" label="Official Instagram" />
                            <SocialLink href="https://x.com/gg_scrapyard" icon="fab fa-twitter" label="Official Twitter/X" />
                            <SocialLink href="https://bsky.app/profile/scrapyard.gg" icon="fab fa-bluesky" label="Official Blue Sky"  />
                            <SocialLink href="https://www.tiktok.com/@scrapyard.gg" icon="fab fa-tiktok" label="Official TikTok" />
                            <SocialLink href="https://www.twitch.tv/scrapyard_gg" icon="fab fa-twitch" label="Official Twitch" />

                        </div>

                        {/* Community Links */}
                        <div className="space-y-6">
                            <h2 className="text-white/80 text-lg font-semibold">Community Social Connections</h2>
                            <SocialLink href="https://www.instagram.com/sy_ir_team/" icon="fab fa-instagram" label="iRacing Team's Instagram" />
                        </div>

                        {/* Site Navigation */}
                        <div className="space-y-4">
                            <h2 className="text-white/80 text-lg font-semibold">Website Navigation</h2>
                            <LinkItem to="/" text="Home" />
                            <LinkItem to="/community" text="Community Hub" />
                            <LinkItem to="/iracing" text="iRacing Team" />
                            <LinkItem to="/development" text="Development" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LinkItem = ({ to, text }) => (
    <Link
        to={to}
        className="block bg-gray-800 hover:bg-gray-700 text-white text-center py-3 rounded-lg
      transform transition-all hover:scale-[1.02] active:scale-95 font-medium"
    >
        {text}
    </Link>
);

const SocialLink = ({ href, icon, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg
      transform transition-all hover:scale-[1.02] active:scale-95 group"
    >
        <div className="flex items-center space-x-4">
            <i className={`${icon} text-xl w-6 text-center`}></i>
            <span>{label}</span>
        </div>
        <i className="fas fa-arrow-up-right-from-square text-sm opacity-50 group-hover:opacity-100"></i>
    </a>
);

export default Link_tree_page;