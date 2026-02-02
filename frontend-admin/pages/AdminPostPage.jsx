import React, { useState, useEffect } from 'react';
import PostList from '../../components/PostList'

const AdminPostPage = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingPost, setEditingPost] = useState(null);

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

const handleDelete = async (postId) => {
    try {
        await fetch(`/api/post/delete/${postId}`, {
            method: 'DELETE',
        });
        setPosts(prev => prev.filter(p => p.id !== postId));
      } catch (err) {
        console.error('Delete failed', err);
}
};

const handleEdit = (postId) => {
  const handleEdit = (postId) => {
  const postToEdit = posts.find(p => p.id === postId);
  setEditingPost(postToEdit);
};}

  if (isLoading) {return <div>Loading...</div>;}
  if (error) return <div>Error: {error}</div>;

  if (editingPost) {
  return (
    <PostForm
    initialPost={editingPost}
    mode="edit"
    onCancel={() => setEditingPost(null)}
    onSubmit={handleUpdate}
    />
  );
} else {
  return (
    <div className="adminPostPage-container">
      <h1>Admin Page</h1>
      <PostList posts={posts} onDelete={handleDelete} onEdit={handleEdit}/>
    </div>
  );
}
}

export default AdminPostPage;

