const express = require("express");
const commentRouter = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const prisma = require('../prismaClient');
const { requireAuth } = require("../middleware/authMiddleware");
const { handleValidationErrors } = require("../validators/handleValidationErrors");
const { validateCommentCreate } = require("../validators/validatorCommentCreate");
const { validateCommentDelete } = require("../validators/validatorCommentDelete");
const { createComment, deleteComment, editComment } = require("../controllers/commentController");



//create comment
commentRouter.post(
   "/comment/create",
  requireAuth,               // authentication middleware (reusable)
  validateCommentCreate,        // validation rules
  handleValidationErrors,    // converts validation failures → 400
  createComment
);

commentRouter.post(
  "/comment/delete/:id",
  requireAuth,
  validateCommentDelete,
  handleValidationErrors,
  deleteComment
)

commentRouter.patch(
  "/comment/edit/:id",
  requireAuth,
  handleValidationErrors,
  editComment
)

module.exports = commentRouter;