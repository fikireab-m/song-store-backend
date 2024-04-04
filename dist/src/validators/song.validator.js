"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songValidator = void 0;
const express_validator_1 = require("express-validator");
const songValidator = () => [
    (0, express_validator_1.body)('title', 'Song title can not be empty').isString().bail().not().isEmpty(),
    (0, express_validator_1.body)('album', 'Album reference required').isMongoId(),
    (0, express_validator_1.body)('artist', 'Artist reference required').isMongoId(),
    (0, express_validator_1.body)('genre', 'Genre reference required').isMongoId(),
];
exports.songValidator = songValidator;
