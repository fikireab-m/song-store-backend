import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
import Song, { SongInterface } from "../model/song_model";
import mongoose, { ObjectId } from "mongoose";
import Artist from "../model/artist.model";
import Album from "../model/album_model";
import Genre from "../model/genre_model";


/**
 * Add a new song
 */
export const addSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { title, artistId, albumId, genreId }: SongInterface = req.body;

    if (!title || !artistId || !albumId || !genreId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    try {

      const exists = await Song.findOne({
        title,
        "artist": artistId,
      });

      if (exists) {
        res.status(400).json({ message: "Song already exists" });
        return;
      }
      const song = new Song({
        title,
        artistId: new mongoose.Types.ObjectId(artistId.toString()),
        albumId: new mongoose.Types.ObjectId(albumId.toString()),
        genreId: new mongoose.Types.ObjectId(genreId.toString())
      });
      const songSaved = await song.save();
      if (songSaved) {
        res.status(201).send(songSaved);
        return;
      }
    } catch (error) {
      next(error);
      return;
    }
  }
);


/**
 * get all songs
 */
export const getSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pageSize, pageLimit } = req.query;
    try {
      const page = parseInt(`${pageSize}`, 10) || 1;
      const limit = parseInt(`${pageLimit}`, 10) || 10;
      const songs = await Song.aggregate([
        {
          $facet: {
            metadata: [{ $count: 'totalSongs' }],
            data: [
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
                $project: { albumId: 0, artistId: 0, genreId: 0, __v: 0 }
              },
              { $skip: (page - 1) * limit },
              { $limit: limit }
            ]
          }
        },
      ]);
      res.status(200).json({
        songs: {
          meta: { 'total songs': songs[0].metadata[0].totalSongs, page, limit },
          data: songs[0].data
        }
      });
    } catch (error) {
      next(error);
    }
  });

/**
 * Search songs
 * either by title,
 * artist name, 
 * album, or genre
 */
export const searchSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { key, title, album, artist, genres, pageSize, pageLimit } = req.query;
    let genreList: string[] = [];
    if (genres !== undefined) {
      let strGenres = JSON.stringify(genres)
      strGenres = strGenres.replace(/\[|\]/g, "")
      genreList = [...strGenres.slice(1, -1).split(",")];
    }
    try {
      const page = parseInt(`${pageSize}`, 10) || 1;
      const limit = parseInt(`${pageLimit}`, 10) || 10;
      const songs = await Song.aggregate([
        {
          $facet: {
            data: [
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
                    ],
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
                $project: { albumId: 0, artistId: 0, genreId: 0, 'artist.name': 0, __v: 0 }
              },
              { $skip: (page - 1) * limit },
              { $limit: limit }
            ],
            metadata: [{ $count: 'totalSongs' }]
          }
        }
      ]);
      res.status(200).json({
        songs: {
          metadata: { "total songs": songs[0].metadata[0].totalSongs, page, limit },
          data: songs[0].data
        }
      });
    } catch (error) {
      next(error)
    }
  });

/**
 * Get all Artists
 */
export const getArtists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const artists = await Artist.find();
      if (artists) {
        res.status(200).send(artists);
      } else {
        res.status(404).json({ message: "No artist found" });
      }
    } catch (error) {
      next(error)
    }
  });

/**
 * Get all Albums
 */
export const getAlbums = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albums = await Album.find();
      if (albums) {
        res.status(200).send(albums);
      } else {
        res.status(404).json({ message: "No Album found" })
      }
    } catch (error) {
      next(error)
    }
  });

/**
 * Get all genres
 */
export const getGenres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await Genre.find();
      if (genres) {
        res.status(200).send(genres);
      } else {
        res.status(404).json({ message: "No genres found" })
      }
    } catch (error) {
      next(error)
    }
  });
/**
 * Update a song using its id
 */
// export const updateSong = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const id = req.params.id;
//       const { title, album, artist, genreId } = req.body;
//       let albumId;
//       let artistId;
//       if (album) {
//         const exists = await Album.find({ name: album });
//         albumId = exists._id;
//       }
//       const updatedSong = await Song.findByIdAndUpdate(id, song, { new: true });
//       if (!updatedSong) {
//         res.status(404).json({ message: "Song not found" });
//         return;
//       }
//       res.status(201).json({ message: "Song updated successfully" });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// /**
//  * Delete a song using its id
//  */
// export const deleteSong = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const id = req.params.id;
//       const deletedSong = await Song.findByIdAndDelete(id);
//       if (!deletedSong) {
//         res.status(404).json({ message: "Song not found" });
//         return;
//       }
//       res.status(200).json({ message: "Song deleted successfully" });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// /**
//  * Get all distinct albums
//  */
// export const getAlbums = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const albums = await Song.aggregate([
//         { $match: { 'album.name': { $exists: true, $ne: "" } } },
//         { $group: { _id: '$album.name' } },
//         { $project: { name: '$_id' } }
//       ]);
//       res.status(200).json(albums);
//       return
//     } catch (err) {
//       next(err)
//     }
//   });


// /**
//  * Get all artists
//  */
// export const getArtists = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const artists = await Song.aggregate([
//         { $match: { 'artist.name': { $exists: true, $ne: "" } } },
//         { $group: { _id: '$artist.name' } },
//         { $project: { name: '$_id' } }
//       ]);
//       res.status(200).json(artists);
//       return;
//     } catch (err) {
//       next(err)
//     }
//   });


// /**
//  * Get all genres
//  */
// export const getGenres = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const genres = await Song.distinct('genre');
//       res.status(200).json(genres);
//       return;
//     } catch (err) {
//       next(err)
//     }
//   });

// /**
//  * Get all songs with specific genre in album
//  */
// export const getSongsOfGenreInAlbum = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const album = req.query.album;
//     const genre = req.query.genre;
//     try {
//       const songs = await Song.aggregate([
//         {
//           $match: { 'album.name': album, genre: genre }
//         },
//         {
//           $group: {
//             _id: null, songs: { $push: "$title" }
//           }
//         },
//         {
//           $project: { songs: 1, _id: 0 }
//         }
//       ])
//       if (songs) {
//         res.status(200).send(songs)
//       } else {
//         res.status(404).json({ message: "Couldn't get any song matching the criteria" })
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// )
