import React, { useState, useEffect } from 'react';
import PostList from '/src/components/PostList';

const PublicPostPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/public');

        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="publicPostPage-container">
      <h1>Posts</h1>
      <PostList posts={posts} />
    </div>
  );
};

export default PublicPostPage;