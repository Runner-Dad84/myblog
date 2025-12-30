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
  loadPost,
  postOwner,
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

module.exports = postRouter;
