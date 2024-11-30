import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const BlogPostComponent = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/blog');
                if (!response.ok) throw new Error('Failed to fetch blog posts');
                const data = await response.json();

                if (data.posts && Array.isArray(data.posts)) {
                    setPosts(data.posts);
                } else {
                    throw new Error('No posts found.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const PostCard = ({ post }) => (
        <div
            key={post.id}
            className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out"
            style={{
                width: "100%", // Ensures the card spans the available space
                overflowWrap: "break-word", // Prevents content overflow
            }}
        >
            {/* User info */}
            <div className="flex items-center mb-4">
                <img
                    src={post.discord_user_pfp || "default-avatar-url"}
                    alt={post.discord_username || "Anonymous"}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <span className="text-lg font-semibold text-red-500">{post.discord_username || "Anonymous"}</span>
            </div>

            {/* Post content */}
            <div
                className="mb-4 text-gray-700 prose prose-red max-w-none"
                style={{
                    whiteSpace: "pre-wrap", // Handles newlines and wraps text naturally
                }}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}>{post.content || "No content available."}</ReactMarkdown>
            </div>

            {/* Date posted */}
            <div className="mt-4 text-sm text-gray-500">
                <span>Posted on: {post.date_posted ? formatDateTime(post.date_posted) : "Date not available"}</span>
            </div>
        </div>
    );

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-white">Loading blog posts...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <div className="text-center">
                    <p className="text-2xl font-bold">Something went wrong</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen py-12 bg-cover bg-center"
            style={{ backgroundImage: "url('/path-to-your-background.jpg')" }}
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-red-500 mb-10">Blog Posts</h1>
                {posts.length > 0 ? (
                    <div className="flex flex-wrap gap-8">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No blog posts available.</div>
                )}
            </div>
        </div>
    );
};

export default BlogPostComponent;
