import React, { useState, useEffect } from 'react';
import PostList from '../../components/PostList'

const HomePageContainer = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
    // Data fetching or other business logic
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post');
        if (!response.ok){
            throw new Error('failed to fetch posts')
        }

        <button
      onClick={() => onDelete(post.id)}
      >Delete Post</button>
    


        const data = await response.json();
        setPosts(data);
        
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
}, []);

const handleDelete = async (postId) => {
    try {
        await fetch(`/api/post/${postId}`, {
            method: 'DELETE',
        });
setPosts(prev => prev.filter(p => p.id !== postId));
} catch (err) {
    console.error('Delete failed', err);
}
};
  
  if (isLoading) {return <div>Loading...</div>;}
  if (error) return <div>Error: {error}</div>;

// This container orchestrates layout and passes data
  return (
    <div className="adminPostPage-container">
      <h1>Admin Page</h1>
      <PostList posts={posts} onDelete={handleDelete}/>

    </div>


      
  );
}
export default AdminPostPage;

