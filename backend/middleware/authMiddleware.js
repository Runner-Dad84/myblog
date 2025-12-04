function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).send("Not authenticated");
  }
  next();
}

module.exports = requireAuth;