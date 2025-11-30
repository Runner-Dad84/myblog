const express = require("express");
const userRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const bcrypt = require("bcryptjs");


//sign up user
userRouter.post("/sign-up", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).send("Username already exists.");
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

    console.log("✅ User created:", newUser);
    res.redirect("/");
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  }
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