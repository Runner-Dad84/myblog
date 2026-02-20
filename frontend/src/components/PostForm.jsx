import React, { useState, useEffect } from 'react';


const PostForm = (
  {
  initialPost = null,
  mode = 'create',
  onSubmit,
  onCancel,
  }
) => {
  const isEditMode = mode === 'edit';
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

useEffect(() => {
  if (initialPost) {
    setFormData({
      title: initialPost.title ?? "",
      content: initialPost.content ?? "",
      isPublic: !!initialPost.isPublic,
      isPublished: !!initialPost.isPublished,
});
}
}, [initialPost]);

const handleSubmit = (e) => {
  e.preventDefault();
  onSubmit(formData);
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
        <label htmlFor="isPublic">Visibility:
          <input
          type="checkbox"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              isPublic: e.target.checked
            }))
          }
          />
        </label>
      </div>
       <div>
        <label htmlFor="isPublished">Published:
          <input
          type="checkbox"
          checked={formData.isPublished}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              isPublished: e.target.checked
            }))
          }
          />
        </label>
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default PostForm;