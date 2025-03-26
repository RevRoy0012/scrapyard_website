import React, { useState } from 'react';

const sponsors = [
    {
        name: 'nixianearts',
        logo: 'https://scrapyard.gg/nixianearts.webp',
        website: 'https://www.instagram.com/nixianearts/',
    },
    {
        name: 'kiddsiscotv',
        logo: 'https://scrapyard.gg/twitch.channel.webp',
        website: 'https://m.twitch.tv/kiddsiscotv/home',
    },
    {
        name: 'Maple Designs',
        logo: 'https://scrapyard.gg/maple.webp',
        website: 'https://www.instagram.com/maplesgfxshed?igsh=OWN3Z2NyajJqMDd0',
    },
];

const scrapyardLogo = 'https://scrapyard.gg/sy_logo.webp';

const styles = {
    sponsorsSection: {
        color: '#fff',
        padding: '50px 20px',
        textAlign: 'center',
    },
    sponsorsTitle: {
        color: '#e10600',
        fontSize: '2.5em',
        marginBottom: '40px',
    },
    sponsorsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '30px',
    },
    sponsorCard: {
        backgroundColor: '#1a1a1a',
        border: '2px solid #e10600',
        borderRadius: '10px',
        padding: '20px',
        width: '200px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
    },
    sponsorCardHover: {
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 20px rgba(225, 6, 0, 0.5)',
    },
    sponsorLogo: {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: '15px',
        objectFit: 'contain',
    },
    sponsorName: {
        fontSize: '1.2em',
        color: '#fff',
    },
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popupContainer: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
    },
    popupLogo: {
        maxWidth: '100px',
        margin: '0 auto 20px',
    },
    popupMessage: {
        fontSize: '1em',
        marginBottom: '20px',
        lineHeight: '1.5',
    },
    popupButton: {
        backgroundColor: '#e10600',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1em',
        cursor: 'pointer',
        margin: '5px',
    },
};

const Iracing_team_sponsors_component = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    const handleCardClick = (sponsor) => {
        setSelectedSponsor(sponsor);
        setPopupVisible(true);
    };

    const handleContinue = () => {
        if (selectedSponsor?.website) {
            window.open(selectedSponsor.website, '_blank');
        }
        setPopupVisible(false);
        setSelectedSponsor(null);
    };

    const handleCancel = () => {
        setPopupVisible(false);
        setSelectedSponsor(null);
    };

    return (
        <section style={styles.sponsorsSection}>
            <h2 style={styles.sponsorsTitle}>Powered By</h2>
            <div style={styles.sponsorsContainer}>
                {sponsors.map((sponsor, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.sponsorCard,
                            ...(hoveredIndex === index ? styles.sponsorCardHover : {}),
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => handleCardClick(sponsor)}
                    >
                        <img
                            src={sponsor.logo}
                            alt={`${sponsor.name} Logo`}
                            style={styles.sponsorLogo}
                        />
                        <p style={styles.sponsorName}>{sponsor.name}</p>
                    </div>
                ))}
            </div>

            {/* Popup Confirmation */}
            {popupVisible && (
                <div style={styles.popupOverlay}>
                    <div style={styles.popupContainer}>
                        <img
                            src={scrapyardLogo}
                            alt="ScrapYard Logo"
                            style={styles.popupLogo}
                        />
                        <p style={styles.popupMessage}>
                            You’re about to leave ScrapYard and visit an external site.
                            Please note that ScrapYard is not responsible for the content,
                            policies, or security of the external website.
                        </p>
                        <button
                            style={styles.popupButton}
                            onClick={handleContinue}
                        >
                            Continue to External Site
                        </button>
                        <button
                            style={styles.popupButton}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Iracing_team_sponsors_component;