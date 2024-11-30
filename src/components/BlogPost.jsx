import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm for better markdown support
import remarkBreaks from 'remark-breaks'; // Import remark-breaks to handle newlines

const BlogPostComponent = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch blog posts from the API
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/blog'); // Replace with your actual API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                console.log("Fetched blog posts:", data);

                // Ensure we're setting the posts array correctly
                if (data.posts && Array.isArray(data.posts)) {
                    setPosts(data.posts); // Set the posts to state
                } else {
                    setError('No posts found.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-white">Loading blog posts...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    // Helper function to format date and time to local machine timezone
    const formatDateTime = (dateString) => {
        const date = new Date(dateString); // Converts UTC to local timezone automatically
        return date.toLocaleString(); // Formats the date and time in the user's local timezone
    };

    return (
        <div className="min-h-screen py-12" style={{ backgroundImage: "url('path/to/your/background-image.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-red-500 mb-10">Blog Posts</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
                                {/* User info */}
                                <div className="flex items-center mb-4">
                                    <img
                                        src={post.discord_user_pfp || 'default-avatar-url'} // Fallback if no pfp
                                        alt={post.discord_username || 'Anonymous'} // Fallback if no username
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <span className="text-lg font-semibold text-red-500">{post.discord_username || 'Anonymous'}</span>
                                </div>

                                {/* Post content */}
                                <div className="mb-4 text-gray-700">
                                    {/* Render markdown using ReactMarkdown with remarkGfm and remarkBreaks */}
                                    <ReactMarkdown
                                        className="prose prose-red max-w-none"
                                        remarkPlugins={[remarkGfm, remarkBreaks]} // Using both remark-gfm and remark-breaks
                                    >
                                        {post.content || 'No content available.'}
                                    </ReactMarkdown>
                                </div>

                                {/* Date posted */}
                                <div className="mt-4 text-sm text-gray-500">
                                    <span>Posted on: {post.date_posted ? formatDateTime(post.date_posted) : 'Date not available'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">No blog posts available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPostComponent;
