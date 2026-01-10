//Requestor must be the commentor or the poster
function commentOwner(req, res, next) {
    const userId = req.user.id;
    const commentOwner = req.comment.userId === userId;
    const postOwner = req.comment.post.userId === userId;
    
  if (!postOwner && !commentOwner) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
}

module.exports = { commentOwner };