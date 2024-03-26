"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const albumSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    art: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});
const Album = (0, mongoose_1.model)("Album", albumSchema);
exports.default = Album;
