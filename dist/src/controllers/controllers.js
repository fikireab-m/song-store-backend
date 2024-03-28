"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenres = exports.getAlbums = exports.getArtists = exports.searchSongs = exports.getSongs = exports.addSong = void 0;
const asyncHandler = require("express-async-handler");
const song_model_1 = __importDefault(require("../model/song_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const artist_model_1 = __importDefault(require("../model/artist.model"));
const album_model_1 = __importDefault(require("../model/album_model"));
const genre_model_1 = __importDefault(require("../model/genre_model"));
exports.addSong = asyncHandler(async (req, res, next) => {
    const { title, artistId, albumId, genreId } = req.body;
    if (!title || !artistId || !albumId || !genreId) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const exists = await song_model_1.default.findOne({
            title,
            "artist": artistId,
        });
        if (exists) {
            res.status(400).json({ message: "Song already exists" });
            return;
        }
        const song = new song_model_1.default({
            title,
            artistId: new mongoose_1.default.Types.ObjectId(artistId.toString()),
            albumId: new mongoose_1.default.Types.ObjectId(albumId.toString()),
            genreId: new mongoose_1.default.Types.ObjectId(genreId.toString())
        });
        const songSaved = await song.save();
        if (songSaved) {
            res.status(201).send(songSaved);
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
        const songs = await song_model_1.default.aggregate([
            {
                $lookup: {
                    from: "albums",
                    localField: "albumId",
                    foreignField: "_id",
                    as: "album"
                }
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "genreId",
                    foreignField: "_id",
                    as: "genre"
                }
            },
            {
                $lookup: {
                    from: "artists",
                    localField: "artistId",
                    foreignField: "_id",
                    as: "artist"
                }
            },
            {
                $unwind: { path: '$artist' }
            },
            {
                $unwind: { path: '$album' }
            },
            {
                $unwind: { path: '$genre' }
            },
            {
                $project: { albumId: 0, artistId: 0, genreId: 0 }
            }
        ]);
        if (songs) {
            res.status(200).send(songs);
        }
        else {
            res.status(404).json({ message: "No songs found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.searchSongs = asyncHandler(async (req, res, next) => {
    const { key, title, album, artist, genres } = req.query;
    let genreList = [];
    if (genres !== undefined) {
        const strGenres = JSON.stringify(genres);
        genreList = [...JSON.parse(strGenres)];
    }
    try {
        const songs = await song_model_1.default.aggregate([
            {
                $lookup: {
                    from: "albums",
                    localField: "albumId",
                    foreignField: "_id",
                    as: "album"
                }
            },
            {
                $lookup: {
                    from: "genres",
                    localField: "genreId",
                    foreignField: "_id",
                    as: "genre"
                }
            },
            {
                $lookup: {
                    from: "artists",
                    localField: "artistId",
                    foreignField: "_id",
                    as: "artist"
                }
            },
            {
                $unwind: { path: '$artist' }
            },
            {
                $unwind: { path: '$album' }
            },
            {
                $unwind: { path: '$genre' }
            },
            {
                $addFields: {
                    "artist.name": { $concat: ["$artist.fname", " ", "$artist.lname"] }
                }
            },
            {
                $match: {
                    ...(key && {
                        $or: [
                            { title: key },
                            { 'artist.fname': key },
                            { 'artist.fname': key },
                            { 'artist.name': key },
                            { 'genre.name': key },
                            { 'album.name': key },
                        ]
                    })
                }
            },
            {
                $match: {
                    ...(title && { title: title })
                }
            },
            {
                $match: {
                    ...(album && { 'album.name': album })
                }
            },
            {
                $match: {
                    ...(artist && { 'artist.name': artist })
                }
            },
            {
                $match: {
                    ...(genreList.length > 0 && { 'genre.name': { $in: genreList } })
                }
            },
            {
                $project: { albumId: 0, artistId: 0, genreId: 0, 'artist.name': 0 }
            }
        ]);
        res.status(200).send(songs);
    }
    catch (error) {
        next(error);
    }
});
exports.getArtists = asyncHandler(async (req, res, next) => {
    try {
        const artists = await artist_model_1.default.find();
        if (artists) {
            res.status(200).send(artists);
        }
        else {
            res.status(404).json({ message: "No artist found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAlbums = asyncHandler(async (req, res, next) => {
    try {
        const albums = await album_model_1.default.find();
        if (albums) {
            res.status(200).send(albums);
        }
        else {
            res.status(404).json({ message: "No Album found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getGenres = asyncHandler(async (req, res, next) => {
    try {
        const genres = await genre_model_1.default.find();
        if (genres) {
            res.status(200).send(genres);
        }
        else {
            res.status(404).json({ message: "No genres found" });
        }
    }
    catch (error) {
        next(error);
    }
});
