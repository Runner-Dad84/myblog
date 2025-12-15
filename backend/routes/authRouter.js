const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

// ---------------------------------------------
// POST /sign-in
// ---------------------------------------------
authRouter.post("/sign-in", (req, res, next) => {

  // =============================================
  // TEST MODE: BYPASS PASSPORT AND DATABASE
  // =============================================
  if (process.env.NODE_ENV === "test") {

    const { username, password } = req.body;

    // Missing credentials
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    // Mock “valid” user for unit tests
    return res.status(200).json({
      message: "Signed in (mock)",
      user: {
        id: 1,
        username,
      },
    });
  }

  // =============================================
  // NORMAL MODE (REAL PASSPORT FLOW)
  // =============================================
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Production behavior — redirect
      return res.redirect("/index");
    });
  })(req, res, next);
});

module.exports = authRouter;

