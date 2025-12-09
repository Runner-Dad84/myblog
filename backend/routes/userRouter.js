const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const bcrypt = require("bcryptjs");
const passport = require("passport")
const userRouter = express.Router();


//sign up user
userRouter.post("/sign-up", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).send({ error: "Username already exists." });
    }
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

      // If running tests → return JSON instead of redirect
      if (process.env.NODE_ENV === "test") {
      return res.status(201).json({
        message: "User created",
        user: newUser,
      });}

    console.log("✅ User created:", newUser);
    res.redirect("/");
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// SIGN IN
userRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/sign-in",
  })
);

// SIGN OUT
userRouter.get("/sign-out", (req, res) => {
  req.logout(() => {
    res.redirect("/sign-in");
  });
});



//signed in user view 
userRouter.get("/index", async (req, res, next) => {
    let posts = {}
    try {
        if (!req.user) { redirect("/sign-up")};
        if (req.user) {
            posts = await prisma.post.findMany({
                where: { userId: req.user.id },
                orderBy: { generatedAt: 'desc' },
      });
        }
        res.render("index", { user: req.user, posts });
    } catch (error){
        console.error("Error fetching posts or rendering:", error);
        res.render("index", { user: req.user, posts: [] }); // fallback safe array
    }

})

module.exports = userRouter;