import React, { useState } from 'react';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: 
        value === "true" ? true : 
        value === "false" ? false : 
        value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
        try {
            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create post");
            }

            const createdPost = await res.json();
            console.log("Post created:", createdPost);
            
            // Optional: reset form
            setFormData({
                title: "",
                content: "",
                isPublic: true,
                isPublished: false,
            });
        
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    
    console.log('Form submitted:', formData);
    alert(`Form submitted with title: ${formData.title}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>
       <div>
        <label htmlFor="isPublic">Visibility:</label>
        <select
          id="isPublic"
          name="isPublic"
          value={String(formData.isPublic)}
          onChange={handleChange}
          required
        >
        <option value="true">Public</option>
        <option value="false">Private</option>
        </select>
      </div>
       <div>
        <label htmlFor="isPublished">Published:</label>
        <select
          id="isPublished"
          name="isPublished"
          value={String(formData.isPublished)}
          onChange={handleChange}
          required
        >
        <option value="true">Published</option>
        <option value="false">Not Published</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;