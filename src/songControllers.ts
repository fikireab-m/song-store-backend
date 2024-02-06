import { Request, Response, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
import Song from "./song_model";

// add new song
export const addSong = asyncHandler(async (req: Request, res: Response) => {
  const { title, artist, album, genre } = req.body;
  if (!title || !artist || !album || !genre) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const exists = await Song.findOne({
      title,
      "artist.fname": artist.fname,
      "artist.lname": artist.lname,
    });
    if (exists) {
      return res.status(400).json({ message: "Song already exists" });
    }
    const song = new Song({ title, artist, album, genre });
    const songSaved = song.save();
    if (songSaved) {
      res.status(201).send(songSaved);
    }
  } catch (error) {
    return res.status(500).json({ message: `${error}` });
  }
});

// get all single song
export const getSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const songs = await Song.find();
    try {
      const songs = await Song.find();
      if (songs.length > 0) {
        res.status(200).send(songs);
      }
    } catch (err) {
      next(err);
    }
  }
);

// get a single song
export const getSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const song = await Song.findById(id);
      res.status(200).send(song);
    } catch (err) {
      next(err);
    }
  }
);
