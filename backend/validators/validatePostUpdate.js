const { body } = require("express-validator");

const validatePostUpdate = [
   body('title')
   .optional()
   .isString().withMessage('Post requires a title')
   .isLength({ max: 150 }).withMessage('Title may not exceed 150 characters')
   .trim(),

   body('content')
   .optional()
   .isString().withMessage('Content must be a string')
   .notEmpty().withMessage('Contact may not be empty')
   .trim(),

   body('isPublic')
   .optional()
   .isBoolean().withMessage('isPublic must be a boolean')
   .toBoolean(),

    body('isPublished')
   .optional()
   .isBoolean().withMessage('isPublished must be a boolean')
   .toBoolean(),

   //cross check to ensure at least one field is changed
   //run last so more specific error messages run

    body().custom((value, { req }) => {
      const fields = ['title', 'content', 'isPublic', 'isPublished'];
      const changedFields = fields.some(field => req.body[field] !== undefined);

      if(!changedFields){
         throw new error('At least one field must be changed')
      }
      return true
   })

];

module.exports = {
  validatePostUpdate,
};