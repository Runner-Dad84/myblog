export const validatePostUpdate = [
   body('title')
   .optional()
   .isString().withMessage('Post requires a title')
   .isLength({ max: 150 }).withMessage('Title may not exceed 150 characters')
   .trim(),

   body('content')
   .optional()
   .isString().message('Content must be a string')
   .notEmpty().message('Contact may not be empty')
   .trim(),

   body('isPublic')
   .optional()
   .isBoolean().message('isPublic must be a boolean')
   .toBoolean(),

    body('isPublished')
   .optional()
   .isBoolean().message('isPublished must be a boolean')
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