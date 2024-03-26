"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers/controllers");
const router = (0, express_1.Router)();
router.route("/songs")
    .post(controllers_1.addSong)
    .get(controllers_1.getSongs);
router.get("/songs/search", controllers_1.searchSongs);
router.get("/albums", controllers_1.getAlbums);
router.get("/artists", controllers_1.getArtists);
router.get("/genres", controllers_1.getGenres);
exports.default = router;
