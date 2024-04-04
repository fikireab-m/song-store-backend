"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorParser = void 0;
const express_validator_1 = require("express-validator");
const errorParser = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        res.status(400).json({
            errors: errors.array()
        });
    }
};
exports.errorParser = errorParser;
