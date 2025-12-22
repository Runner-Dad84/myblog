const express = require("express");
const postRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const { requireAuth } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../validators/handleValidationErrors");
const { validatePostCreate } = require("../validators/validatorPostCreate");
const { validatePostDelete } = require("../validators/validatorPostDelete");
const { createPost, deletePost, editPost } = require("../controllers/postController");



//create post
postRouter.post(
   "/post/create",
  requireAuth,               // authentication middleware (reusable)
  validatePostCreate,        // validation rules
  handleValidationErrors,    // converts validation failures → 400
  createPost
);

postRouter.post(
  "/post/delete/:id",
  requireAuth,
  validatePostDelete,
  handleValidationErrors,
  deletePost
)

postRouter.patch(
  "/post/edit/:id",
  requireAuth,
  handleValidationErrors,
  editPost
)

//edit post
postRouter.patch("/post/edit/:id", async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    

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
