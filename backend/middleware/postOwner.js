function postOwner(req, res, next) {
  if (req.post.userId !== req.user.id) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
}

module.exports = { postOwner };