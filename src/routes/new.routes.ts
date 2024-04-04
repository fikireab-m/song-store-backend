import { Router } from "express";
import { addSong, getAlbums, getArtists, getGenres, getSongs, searchSongs } from "../controllers/controllers";
import { songValidator } from "../validators/song.validator";
import { errorParser } from "../middlewares/error.parser";
import { artistValidator } from "../validators/artist.validator";

const router = Router();
router.route("/songs")
    .post(songValidator(), errorParser, addSong)
    .get(getSongs);
router.get("/songs/search", searchSongs);

router.get("/albums", getAlbums);
router.get("/artists", getArtists);
router.get("/genres", getGenres);


export default router;