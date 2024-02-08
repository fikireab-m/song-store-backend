import express from "express";
import {
    addSong,
    deleteSong,
    getAlbums,
    getArtists,
    getGenres,
    getSong,
    getSongs,
    getSongsAndAlbumsCountByArtist,
    updateSong
} from "../controllers/controllers";

const songRoutes = express.Router();
const albumRoutes = express.Router();
const artistRoutes = express.Router();
const genreRoutes = express.Router();

songRoutes
    .get("/", getSongs)
    .get("/:id", getSong)
    .post("/add", addSong)
    .put("/:id", updateSong)
    .delete("/:id", deleteSong);

albumRoutes.get("/", getAlbums);

artistRoutes
    .get("/", getArtists)
    .get("/:artistName", getSongsAndAlbumsCountByArtist);

genreRoutes.get("/", getGenres);

export { songRoutes, albumRoutes, artistRoutes, genreRoutes };
