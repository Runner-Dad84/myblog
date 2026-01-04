const express = require("express");
const postRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const { requireAuth } = require("../middleware/authMiddleware");
const { loadPost } = require("../middleware/loadPost");
const { postOwner } = require("../middleware/postOwner");
const { handleValidationErrors } = require("../validators/handleValidationErrors");
const { validatePostCreate } = require("../validators/validatorPostCreate");
const { validatePostUpdate } = require("../validators/validatorPostCreate");
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
  requireAuth,              // authentication middleware (reusable)
  loadPost,                 // middleware - checks post id valid, check post exists
  postOwner,                // middleware - checks requestor user id matches user id on target post
  handleValidationErrors,   // converts validation failures → 400
  deletePost
)

postRouter.patch(
  "/post/edit/:id",
  requireAuth,               // authentication middleware (reusable)
  validatePostUpdate,        // validation rules
  handleValidationErrors,    // converts validation failures → 400
  loadPost,                  // middleware - checks post id valid, check post exists
  postOwner,                 // middleware - checks requestor user id matches user id on target post
  editPost
)

module.exports = postRouter;
