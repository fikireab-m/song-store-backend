"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSongs = exports.getSongs = exports.addSong = void 0;
const asyncHandler = require("express-async-handler");
const song_model_1 = __importDefault(require("../model/song_model"));
const mongoose_1 = __importDefault(require("mongoose"));
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
    const { genre, album, artist, title } = req.query;
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
            },
            {
                $match: {
                    ...(title && {
                        title: title
                    })
                }
            },
            {
                $match: {
                    ...(artist && {
                        'artist.fname': artist
                    })
                }
            },
            {
                $match: {
                    ...(album && {
                        'album.name': album
                    })
                }
            },
            {
                $match: {
                    ...(genre && {
                        'genre.name': genre
                    })
                }
            },
        ]);
        res.status(200).send(songs);
    }
    catch (error) {
        next(error);
    }
});
