"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongsCountByAlbum = exports.getSongsAndAlbumsCountByArtist = exports.getSongsCountByGenre = exports.getGenresCount = exports.getAlbumsCount = exports.getArtistsCount = exports.getSongsCount = void 0;
const song_model_1 = __importDefault(require("./model/song_model"));
const getSongsCount = async (req, res, next) => {
    try {
        const count = await song_model_1.default.countDocuments();
        res.json({ count });
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getSongsCount = getSongsCount;
const getArtistsCount = async (req, res) => {
    try {
        const artists = await song_model_1.default.distinct('artist');
        res.json({ count: artists.length });
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getArtistsCount = getArtistsCount;
const getAlbumsCount = async (req, res) => {
    try {
        const albums = await song_model_1.default.distinct('album.name');
        res.json({ count: albums.length });
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getAlbumsCount = getAlbumsCount;
const getGenresCount = async (req, res) => {
    try {
        const genres = await song_model_1.default.distinct('genre');
        res.json({ count: genres.length });
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getGenresCount = getGenresCount;
const getSongsCountByGenre = async (req, res) => {
    try {
        const songsByGenre = await song_model_1.default.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } },
        ]);
        res.json(songsByGenre);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getSongsCountByGenre = getSongsCountByGenre;
const getSongsAndAlbumsCountByArtist = async (req, res) => {
    try {
        const songsAndAlbumsByArtist = await song_model_1.default.aggregate([
            {
                $group: {
                    _id: '$artist',
                    songsCount: { $sum: 1 },
                    albumsCount: { $addToSet: '$album.name' },
                },
            },
            {
                $project: {
                    _id: 1,
                    songsCount: 1,
                    albumsCount: { $size: '$albumsCount' },
                },
            },
        ]);
        res.json(songsAndAlbumsByArtist);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getSongsAndAlbumsCountByArtist = getSongsAndAlbumsCountByArtist;
const getSongsCountByAlbum = async (req, res) => {
    try {
        const songsByAlbum = await song_model_1.default.aggregate([
            { $group: { _id: '$album.name', count: { $sum: 1 } } },
        ]);
        res.json(songsByAlbum);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.getSongsCountByAlbum = getSongsCountByAlbum;
