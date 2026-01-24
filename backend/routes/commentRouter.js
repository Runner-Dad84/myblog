const express = require("express");
const commentRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const { requireAuth } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../middleware/handleValidationErrors");
const { validateCommentCreate } = require("../validators/validateCommentCreate");
const { loadComment } = require("../middleware/loadComment");
const { commentOwner } = require("../middleware/commentOwner");
const { createComment, deleteComment } = require("../controllers/commentController");

//create comment
commentRouter.post(
  "/comment/create/:postId",
  requireAuth,               // authentication middleware (reusable)
  validateCommentCreate,
  handleValidationErrors,    // converts validation failures → 400
  createComment
);

commentRouter.post(
  "/comment/delete/:id",
  requireAuth,
  handleValidationErrors,
  loadComment,  
  commentOwner,  
  deleteComment
);

module.exports = commentRouter;