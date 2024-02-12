import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
import Song, { SongInterface } from "../model/song_model";

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

    const { title, artist, album, genre }: SongInterface = req.body;

    if (!title || !artist || !album || !genre) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    try {
      const exists = await Song.findOne({
        title,
        "artist.name": artist.name,
      });
      if (exists) {
        res.status(400).json({ message: "Song already exists" });
        return;
      }
      const song = new Song({ title, artist, album, genre });
      const songSaved = await song.save();
      if (songSaved) {
        res.status(201).json(songSaved);
        return;
      }
    } catch (error) {
      next(error);
      return;
    }
  }
);

/**
 * get all songs +++ filtering using query params 
 * like title, artist, album, and genre. 
 * 
 * If any filter is not applied, it sends all songs.
 * 
 * Using this method, we can get a specific song, songs of each artist, 
 * songs in each album, songs of specific Genre, or songs that satisfy 
 * combination of 2 or more filters.
 */
export const getSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let songs: SongInterface[];

      const { title, album, artist, genre } = req.query;

      /**
       * if any of the filtering parameters aren't applied send all songs
       */
      if (!title && !album && !artist && !genre) {
        songs = await Song.find();
        res.status(200).json(songs);
        return;
      }

      let queryParams: QueryParm = {};

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
      songs = await Song.find(queryParams);
      if (!songs.length) {
        res.status(404).json({ message: 'No songs found' });
        return;
      }
      res.status(200).json({ songs, count: songs.length });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * get a single song using its id
 */
export const getSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const song = await Song.findById(id);
      res.status(200).send(song);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Update a song using its id
 */
export const updateSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const song: Partial<SongInterface> = req.body;
      const updatedSong = await Song.findByIdAndUpdate(id, song, { new: true });
      if (!updatedSong) {
        res.status(404).json({ message: "Song not found" });
        return;
      }
      res.status(201).json({ message: "Song updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Delete a song using its id
 */
export const deleteSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const deletedSong = await Song.findByIdAndDelete(id);
      if (!deletedSong) {
        res.status(404).json({ message: "Song not found" });
        return;
      }
      res.status(200).json({ message: "Song deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Get all distinct albums
 */
export const getAlbums = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const albums = await Song.distinct('album', { 'album.name': { $exists: true } });
      res.status(200).json(albums);
      return
    } catch (err) {
      next(err)
    }
  });


/**
 * Get all artists
 */
export const getArtists = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const artists = await Song.distinct('artist', { 'artist.name': { $exists: true } });
      res.status(200).json(artists);
      return;
    } catch (err) {
      next(err)
    }
  });


/**
 * Get all genres
 */
export const getGenres = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const genres = await Song.distinct('genre');
      res.status(200).json(genres);
      return;
    } catch (err) {
      next(err)
    }
  });


/**
 * Get songs and albums count of a specific artist by using
 * aggregated query
 */
export const getSongsAndAlbumsCountByArtist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const artist = req.params.artistName;
      const songsAndAlbumsByArtist = await Song.aggregate([
        {
          $match: { 'artist.name': artist }
        },
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
      res.status(200).json(songsAndAlbumsByArtist);
    } catch (err) {
      next(err);
    }
  });