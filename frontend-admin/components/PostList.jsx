import React from 'react';
import './PostList.css'; //

const PostList = ({ posts = [] }) => {

    const list = posts.map((post) => 
        <li key = {post.id}>
            Title: {post.title}
            Author: {post.user.username}
            Posted: {post.generatedAt}
            Public: {post.isPublic ? 'Yes' : 'No'}
            Visible: {post.isPublished ? 'Yes' : 'No'}
        </li>
    )
    return (
        <ul>{list}</ul>
    )  
}

export default PostList;
