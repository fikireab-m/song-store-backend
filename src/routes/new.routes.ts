import { Router } from "express";
import { addSong, getSongs, searchSongs } from "../controllers/controllers";

const router = Router();
router.route("/")
    .post(addSong)
    .get(searchSongs);

export default router;