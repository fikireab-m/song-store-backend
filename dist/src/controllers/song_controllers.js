"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtists = exports.getAlbums = exports.getSong = exports.getSongs = exports.addSong = void 0;
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
            "artist.fname": artist.fname,
            "artist.lname": artist.lname,
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
            queryParams['artist.fname'] = artist.toString();
        }
        if (genre) {
            queryParams['genre'] = genre.toString();
        }
        songs = await song_model_1.default.find(queryParams);
        if (!songs.length) {
            res.status(404).json({ message: 'No songs found' });
            return;
        }
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
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
exports.getAlbums = asyncHandler(async (req, res, next) => {
    try {
        const albums = await song_model_1.default.distinct('album', { 'album.name': { $exists: true } });
        res.json({
            albums: albums,
            count: albums.length
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getArtists = asyncHandler(async (req, res, next) => {
    try {
        const artists = await song_model_1.default.distinct('artist', { 'artist.fname': { $exists: true }, 'artist.lname': { $exists: true } });
        res.json({
            albums: artists,
            count: artists.length
        });
    }
    catch (err) {
        next(err);
    }
});
