"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const songSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    albumId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    genreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true,
});
const Song = (0, mongoose_1.model)("Song", songSchema);
exports.default = Song;
