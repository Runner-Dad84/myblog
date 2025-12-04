const express = require("express");
const postRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');


//create post
postRouter.post("/post/create", async (req, res) => {
  try {
    
    const { title, isPublic } = req.body;

      // basic validation / default
    const postTitle = (title && String(title).trim()) || "Untitled Folder";

    // make sure we have a user id (adjust to your auth/session setup)
    const userId = req.user?.id;
    
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

//delete post
postRouter.post("/post/delete/:id", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    console.log("DELETE POST HIT:", postId);

  try {
      //prevents a user from deleting another users post
      const post = await prisma.post.findUnique({
      where: { id: postId },
      });

    if (!post) {
        return res.status(403).send("Not authorized to delete this post");
    }

    // Prevent any user from deleting any other user's post
    if (post.userId !== userId) {
      return res.status(403).send("Not authorized to delete this post");
    }

     // Delete child comments first to satisfy foreign key constraints
    await prisma.comment.deleteMany({
      where: { postId: parseInt(postId) },
    });

    // Then delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    console.log('Deleted', postId);

    res.redirect("/"); 
} catch (err) {
    console.log(err)
    res.status(500).send("Server error");
};
}
);

//edit post
postRouter.patch("/post/edit/:id", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    console.log("EDIT POST HIT:", postId);

    try {
        //check if user authorized
        if (!userId) {
            return res.status(401).send("User not authorized"); 
        }
        //Find the specific post
        const post = await prisma.post.findUnique({
             where: { id: postId },
        });
         //make sure post exists
        if (!post) {
            return res.status(404).send("Post not found");
        }
         // Prevent any user from editing any other user's post
        if (post.userId !== userId) {
            return res.status(403).send("Not authorized to edit this post");
        }
        //updated post
        const updates = {};

        if (req.body.title !==  undefined){
               updates.title = String(req.body.title).trim();
        }
        //if no updates made do not update
        if (Object.keys(updates).length === 0) {
            return res.status(400).send("No updates entered");
        }
       
        //replace the specific post with the update post
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updates
        });
        //finally return updated post
        res.json(updatedPost)

    } catch (err) {
        console.log(err)
        res.status(500).send("Server error");
    }
})

module.exports = postRouter;
