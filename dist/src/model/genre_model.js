"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const genreScheme = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const Genre = (0, mongoose_1.model)("Genre", genreScheme);
exports.default = Genre;
