"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtists = exports.getAlbums = void 0;
const asyncHandler = require("express-async-handler");
const song_model_1 = __importDefault(require("../model/song_model"));
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
