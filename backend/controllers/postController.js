const prisma = require("../prismaClient");



async function createPost(req, res) {
    try {
    const { title, isPublic, isPublished, content } = req.body;
    const userId = req.user?.id;

      const newPost = await prisma.post.create({
      data: {
        title: postTitle,
        content: content,
        userId,
        // only include isPublic if specified
        ...(typeof isPublic === "boolean" && { isPublic }),
        ...(typeof isPublished === "boolean" && { isPublished }),
      },
    });
     res.status(201).json({ message: "Post created", post: newPost });
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
  createPost,
};