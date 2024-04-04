"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistValidator = void 0;
const express_validator_1 = require("express-validator");
const artistValidator = () => (0, express_validator_1.checkSchema)({
    fname: { isLength: { options: { min: 1, max: 20 }, errorMessage: "Name should be non empty string at most 20 characters long" } },
    lname: { isLength: { options: { min: 1, max: 20 }, errorMessage: "Name should be non empty string at most 20 characters long" } },
    avatar: { isURL: true, errorMessage: "Invalid avatar url" }
});
exports.artistValidator = artistValidator;
