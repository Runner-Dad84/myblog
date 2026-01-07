//Requestor must be the commentor or the poster
function commentOwner(req, res, next) {
    const commentOwner = req.comment.userId === req.user.id;
    const postOwner = req.post.userId === req.user.id;
    
  if (!postOwner && !commentOwner) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
}

module.exports = { commentOwner };