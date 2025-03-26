import React, { useState, useEffect } from 'react';

const API_URL = "https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/metrics/public/gallary";

const Community_gallery_component = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Failed to fetch gallery data.");
                const data = await response.json();
                setImages(data.galleryItems || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    return (
        <section className="py-12 text-center bg-gray-900">
            <h2 className="text-4xl font-bold text-red-500 mb-8">📸 Community Gallery</h2>

            {loading ? (
                <p className="text-white">Loading gallery...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {images.map((img, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg bg-black border border-gray-700">
                            <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                            <p className="text-gray-300 text-sm mt-2">Uploaded by {img.uploader}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Community_gallery_component;