import { param } from "express-validator";

export const validatePostDelete = [

    param ('id')
    .exists ()
    .withMessage('Post id required')
    .isInt
    .withMessage('Id must be an integer')
];