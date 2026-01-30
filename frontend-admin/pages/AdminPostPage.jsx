import React, { useState, useEffect } from 'react';
import PostList from '../../components/PostList'

const HomePageContainer = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(true)

    useEffect(() => {
    // Data fetching or other business logic
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post');
        if (!response.ok){
            throw new Error('failed to fetch posts')
        }


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

    
  

  if (isLoading) {return <div>Loading...</div>;}
  if (error) return <div>Error: {error}</div>;

  return (
    // This container orchestrates layout and passes data
    <div className="adminPostPage-container">
      <h1>Admin Page</h1>
      <PostList posts={posts} />
    </div>
  );
}
export default AdminPostPage;

