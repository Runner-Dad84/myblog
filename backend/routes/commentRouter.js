const express = require("express");
const commentRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');

//create post
postRouter.post("/comment/create", async (req, res) => {
  try {
    const { title, isPublic } = req.body;

      // basic validation / default
    const postTitle = (title && String(title).trim()) || "Untitled Folder";

    // make sure we have a user id (adjust to your auth/session setup)
    const userId = req.user?.id;
    const postId = req.post?.id;
    
    if (!userId) {
      // if unauthenticated, either reject or use a test fallback
      return res.status(401).json({ error: "Not authenticated" });}
      // OR for testing: const userId = 1;

    const newPost = await prisma.post.create({
      data: {
        title: postTitle,
        userId,
        // only include isPublic if specified
        ...(typeof isPublic === "boolean" && { isPublic }),
      },
    });
     res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
     console.error(err);
    res.status(500).json({ error: err.message });
  }
})