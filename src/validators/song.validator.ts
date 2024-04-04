import { body } from "express-validator";

export const songValidator = ()=>[
    body('title','Song title can not be empty').isString().bail().not().isEmpty(),

    body('album', 'Album reference required').isMongoId(),
    body('artist','Artist reference required').isMongoId(),
    body('genre','Genre reference required').isMongoId(),
]