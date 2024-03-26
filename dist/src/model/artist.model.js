"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const artistSchema = new mongoose_1.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});
const Artist = (0, mongoose_1.model)("Artist", artistSchema);
exports.default = Artist;
