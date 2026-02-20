import React, { useState, useEffect } from 'react';
import PostList from '/src/components/PostList';
import PostForm from '/src/components/PostForm';
import SignOut from '/src/components/SignOut';

const AdminPostPage = ( {onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activePost, setActivePost] = useState(null);
  

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

function handleEdit(post) {
  setActivePost(post);
}

function handleCreate() {
  setActivePost({}); // empty object signals "create"
}

const handleCreateSubmit = async (newPost) => {
  try {
    const res = await fetch('/api/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newPost),
    });

    const data = await res.json();  // ← define data FIRST

    if (!res.ok) {
      console.log("Backend error:", data);
      throw new Error(data.error || 'Failed to create post');
    }

    setPosts(prev => [...prev, data.post]);
    setActivePost(null);

  } catch (err) {
    console.error('Create failed', err);
  }
};


const handleUpdate = async ( updatedPost ) => {
  try {
    const res = await fetch(`/api/post/edit/${updatedPost.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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
    setActivePost(null);
  } catch (err) {
    console.error('Update failed', err);
  }
};

  if (isLoading) {return <div>Loading...</div>;}
  if (error) return <div>Error: {error}</div>;

 if (activePost) {
  const isEdit = activePost?.id != null;

  return (
    <PostForm
      initialPost={isEdit ? activePost : null}
      mode={isEdit ? "edit" : "create"}
      onCancel={() => setActivePost(null)}
      onSubmit={isEdit ? handleUpdate : handleCreateSubmit}
    />
  );
}
  return (
    <div className="adminPostPage-container">
      <h1>Admin Page</h1>
      <button onClick={handleCreate}>New Post</button>
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

