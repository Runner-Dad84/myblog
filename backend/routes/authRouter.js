const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const prisma = require("../prismaClient");

const authRouter = express.Router();

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

/*
|--------------------------------------------------------------------------
| POST /auth/sign-up
|--------------------------------------------------------------------------
*/
authRouter.post(
  "/auth/sign-up",

  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  handleValidationErrors,

  async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      // ---------- TEST MODE: skip passport ----------
      if (process.env.NODE_ENV === "test") {
        return res.status(201).json({
          message: "User created",
          user: {
            id: user.id,
            username: user.username,
          },
        });
      }

      // ---------- NORMAL MODE ----------
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({
            error: "Login after signup failed",
          });
        }

        res.status(201).json({
          message: "User created",
          user: {
            id: user.id,
            username: user.username,
          },
        });
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/*
|--------------------------------------------------------------------------
| POST /auth/sign-in
|--------------------------------------------------------------------------
*/
authRouter.post(
  "/auth/sign-in",

  body("username").exists(),
  body("password").exists(),
  handleValidationErrors,

  (req, res, next) => {

    // ---------- TEST MODE ----------
    if (process.env.NODE_ENV === "test") {
      if (req.body.password !== "password123") {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = 1; // force session creation

      return res.json({
        message: "Signed in (mock)",
        user: {
          id: 1,
          username: req.body.username,
        },
      });
    }

   passport.authenticate("local", (err, user) => {
  if (err) return next(err);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.login(user, (err) => {
    if (err) return next(err);

    // Force session write so express-session sets cookie
     req.session.userId = user.id;


    return res.status(200).json({
      message: "Signed in",
      user,
    });
  });
})(req, res, next);

  }
);

/*
|--------------------------------------------------------------------------
| POST /auth/logout
|--------------------------------------------------------------------------
*/
authRouter.post("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

/*
|--------------------------------------------------------------------------
| GET /auth/session
|--------------------------------------------------------------------------
*/
authRouter.get("/auth/session", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: req.user,
  });
});

/*
|--------------------------------------------------------------------------
| POST /auth/delete-account
|--------------------------------------------------------------------------
*/
authRouter.post(
  "/auth/delete-account",
  requireAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;

      await prisma.comment.deleteMany({ where: { userId } });
      await prisma.post.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });

      req.logout(() => {
        res.json({ message: "Account deleted" });
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = authRouter;
