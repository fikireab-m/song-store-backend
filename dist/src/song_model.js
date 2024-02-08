"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const songSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    artist: {
        fname: {
            type: String,
            required: [true, "First name is required"],
        },
        lname: {
            type: String,
            required: [true, "Last name is required"],
        },
        avatarUrl: {
            type: String,
            default: "https://icon-library.com/images/generic-person-icon/generic-person-icon-1.jpg",
        },
    },
    album: {
        name: {
            type: String,
            required: [true, "Album name is required"],
        },
        albumArt: {
            type: String,
            default: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    },
    genre: {
        type: String,
        required: [true, "Genere is required"],
    },
}, {
    timestamps: true,
});
const Song = mongoose_1.default.model("Song", songSchema);
exports.default = Song;
