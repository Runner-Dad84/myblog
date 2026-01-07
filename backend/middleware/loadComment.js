// middleware/loadComment.js
const prisma = require('../prismaClient');

async function loadComment(req, res, next) {
  const commentId = parseInt(req.params.id || req.params.commentId, 10);

  if (Number.isNaN(commentId)) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return res.status(404).json({ error: "Post not found" });
  }

  req.comment = comment;
  req.post = comment.post;
  
  next();
}

module.exports = { loadComment };