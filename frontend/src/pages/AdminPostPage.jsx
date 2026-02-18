import React, { useState, useEffect } from 'react';
import PostList from '/src/components/PostList';
import PostForm from '/src/components/PostForm';
import SignOut from '/src/components/SignOut';

const AdminPostPage = ( {onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
    // Data fetching or other business logic
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/posts');
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
        const res =await fetch(`/api/post/delete/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Delete failed');
        }
        setPosts(prev => prev.filter(p => p.id !== postId));
      } catch (err) {
        console.error('Delete failed', err);
}
};

const handleEdit = (postId) => {
  const postToEdit = posts.find(p => p.id === postId);
  setEditingPost(postToEdit);
};

const handleUpdate = async ( updatedPost ) => {
  try {
    const res = await fetch(`/api/post/edit/${updatedPost.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    });

    if (!res.ok) {
      throw new Error('Failed to update post');
    }

    const savedPost = await res.json();

    // Update local state (no refetch needed)
    setPosts(prev =>
      prev.map(p => (p.id === savedPost.id ? savedPost : p))
    );

    // Exit edit mode
    setEditingPost(null);
  } catch (err) {
    console.error('Update failed', err);
  }
};

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
};
  return (
    <div className="adminPostPage-container">
      <h1>Admin Page</h1>
      <SignOut onLogout={onLogout} />
      
      {posts.length === 0 ? (
      <span>No posts yet</span>
    ) : (
    <PostList 
      posts={posts} 
      onDelete={handleDelete} 
      onEdit={handleEdit}
      />
      )}
    </div>
  );
}


export default AdminPostPage;

