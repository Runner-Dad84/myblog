const { param } = require ("express-validator");

const validateCommentCreate = [

    param ('postId')
    .isInt()
    .withMessage("postId must be a valid integer"),
    
];

module.exports = {
  validateCommentCreate,
};