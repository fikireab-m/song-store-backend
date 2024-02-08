"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSong = exports.getSongs = exports.addSong = void 0;
const asyncHandler = require("express-async-handler");
const song_model_1 = __importDefault(require("./song_model"));
exports.addSong = asyncHandler(async (req, res, next) => {
    const { title, artist, album, genre } = req.body;
    if (!title || !artist || !album || !genre) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const exists = await song_model_1.default.findOne({
            title,
            "artist.fname": artist.fname,
            "artist.lname": artist.lname,
        });
        if (exists) {
            return res.status(400).json({ message: "Song already exists" });
        }
        const song = new song_model_1.default({ title, artist, album, genre });
        const songSaved = await song.save();
        if (songSaved) {
            res.status(201).json(songSaved);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getSongs = asyncHandler(async (req, res, next) => {
    const songs = await song_model_1.default.find();
    try {
        const songs = await song_model_1.default.find();
        if (songs.length > 0) {
            res.status(200).send(songs);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getSong = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    try {
        const song = await song_model_1.default.findById(id);
        res.status(200).send(song);
    }
    catch (err) {
        next(err);
    }
});
