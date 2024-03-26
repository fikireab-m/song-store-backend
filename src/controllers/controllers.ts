import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
import Song, { SongInterface } from "../model/song_model";
import mongoose, { ObjectId } from "mongoose";
import Artist from "../model/artist.model";
import Album from "../model/album_model";
import Genre from "../model/genre_model";

/**
 * for filtering parameters
 */
interface QueryParm {
  [key: string]: string
}

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
    try {
      const songs = await Song.aggregate([
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
      } else {
        res.status(404).json({ message: "No songs found" });
      }
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
    const { genre, album, artist, title } = req.query
    try {
      const songs = await Song.aggregate([
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
              $or: [
                { 'artist.fname': artist },
                { 'artist.fname': artist }
              ]
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
// /**
//  * Update a song using its id
//  */
// export const updateSong = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const id = req.params.id;
//       const song: Partial<SongInterface> = req.body;
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
