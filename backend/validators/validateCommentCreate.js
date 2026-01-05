const { param } = require ("express-validator");


export const validateCommentCreate = [

    param ('postId')
    .isInt()
    .withMessage("postId must be a valid integer"),
    
];