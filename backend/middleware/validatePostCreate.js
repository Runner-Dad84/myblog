import { body } from "express-validator";

export const validatePostCreate = [

    body ('title')
    .exists ({ checkFalsy: true })
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be string')
    .isLength({ max: 150 })
    .withMessage('Title length may not exceed 150 characters'),

    body('content')
    .exists ({ checkFalsy: true })
    .withMessage('Post content is required')
    .isString()
    .withMessage('Post content must be string')
    .trim()
    .notEmpty()
    .withMessage("Body cannot be empty"),

    body('isPublic')
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
]
     