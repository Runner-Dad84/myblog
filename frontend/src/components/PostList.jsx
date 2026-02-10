import React from 'react';
//import './PostList.css'; //

const PostList = ({ 
    posts = [],
    onDelete,
    onEdit,
    isAdmin = false
}) => {

    
    const list = posts.map((post) => 
        <li key = {post.id}>
            
            Title: {post.title}
            Author: {post.user.username}
            Posted: {post.generatedAt}
            // comments may be undefined until wired up
            Comments: {post.comments?.length ?? 0}
            Public: {post.isPublic ? 'Yes' : 'No'}
            Visible: {post.isPublished ? 'Yes' : 'No'}

            <button onClick={() => onDelete(post.id)}>Delete</button>
            <button onClick={() => onEdit(post.id)}>Edit</button>

            {isAdmin && (
                <div className="post-actions">
                    <button onClick={() => onEdit(post.id)}>Edit</button>
                    <button onClick={() => onDelete(post.id)}>Delete</button>
                </div>
            )}
        </li>
    )
    return (
        <ul>{list}</ul>
    )  
}

export default PostList;
