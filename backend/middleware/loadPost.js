// middleware/loadPost.js
const prisma = require('../prismaClient');

async function loadPost(req, res, next) {
  const postId = parseInt(req.params.id || req.params.postId, 10);

  if (Number.isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  req.post = post;
  next();
}

module.exports = loadPost;