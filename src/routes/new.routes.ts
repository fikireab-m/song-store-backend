import { Router } from "express";
import { addSong, getAlbums, getArtists, getGenres, getSongs, searchSongs } from "../controllers/controllers";

const router = Router();
router.route("/songs")
    .post(addSong)
    .get(getSongs);
router.get("/songs/search", searchSongs);

router.get("/albums", getAlbums);
router.get("/artists", getArtists);
router.get("/genres", getGenres);


export default router;