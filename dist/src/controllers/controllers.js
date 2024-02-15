"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenres = exports.getArtists = exports.getAlbums = exports.deleteSong = exports.updateSong = exports.getSongs = exports.addSong = void 0;
const asyncHandler = require("express-async-handler");
const song_model_1 = __importDefault(require("../model/song_model"));
exports.addSong = asyncHandler(async (req, res, next) => {
    const { title, artist, album, genre } = req.body;
    if (!title || !artist || !album || !genre) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const exists = await song_model_1.default.findOne({
            title,
            "artist.name": artist.name,
        });
        if (exists) {
            res.status(400).json({ message: "Song already exists" });
            return;
        }
        const song = new song_model_1.default({ title, artist, album, genre });
        const songSaved = await song.save();
        if (songSaved) {
            res.status(201).json(songSaved);
            return;
        }
    }
    catch (error) {
        next(error);
        return;
    }
});
exports.getSongs = asyncHandler(async (req, res, next) => {
    try {
        let songs;
        const { title, album, artist, genre } = req.query;
        if (!title && !album && !artist && !genre) {
            songs = await song_model_1.default.find();
            res.status(200).json(songs);
            return;
        }
        let queryParams = {};
        if (title) {
            queryParams['title'] = title.toString();
        }
        if (album) {
            queryParams['album.name'] = album.toString();
        }
        if (artist) {
            queryParams['artist.name'] = artist.toString();
        }
        if (genre) {
            queryParams['genre'] = genre.toString();
        }
        songs = await song_model_1.default.find(queryParams);
        if (!songs.length) {
            res.status(404).json({ message: 'No songs found' });
            return;
        }
        res.status(200).json({ songs, count: songs.length });
    }
    catch (error) {
        next(error);
    }
});
exports.updateSong = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const song = req.body;
        const updatedSong = await song_model_1.default.findByIdAndUpdate(id, song, { new: true });
        if (!updatedSong) {
            res.status(404).json({ message: "Song not found" });
            return;
        }
        res.status(201).json({ message: "Song updated successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteSong = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedSong = await song_model_1.default.findByIdAndDelete(id);
        if (!deletedSong) {
            res.status(404).json({ message: "Song not found" });
            return;
        }
        res.status(200).json({ message: "Song deleted successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.getAlbums = asyncHandler(async (req, res, next) => {
    try {
        const albums = await song_model_1.default.distinct('album', { 'album.name': { $exists: true } });
        res.status(200).json(albums);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getArtists = asyncHandler(async (req, res, next) => {
    try {
        const artists = await song_model_1.default.distinct('artist', { 'artist.name': { $exists: true } });
        res.status(200).json(artists);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getGenres = asyncHandler(async (req, res, next) => {
    try {
        const genres = await song_model_1.default.distinct('genre');
        res.status(200).json(genres);
        return;
    }
    catch (err) {
        next(err);
    }
});
