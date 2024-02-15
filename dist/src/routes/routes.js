"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genreRoutes = exports.artistRoutes = exports.albumRoutes = exports.songRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/controllers");
const songRoutes = express_1.default.Router();
exports.songRoutes = songRoutes;
const albumRoutes = express_1.default.Router();
exports.albumRoutes = albumRoutes;
const artistRoutes = express_1.default.Router();
exports.artistRoutes = artistRoutes;
const genreRoutes = express_1.default.Router();
exports.genreRoutes = genreRoutes;
songRoutes
    .get("/", controllers_1.getSongs)
    .post("/add", controllers_1.addSong)
    .put("/:id", controllers_1.updateSong)
    .delete("/:id", controllers_1.deleteSong);
albumRoutes.get("/", controllers_1.getAlbums);
artistRoutes
    .get("/", controllers_1.getArtists);
genreRoutes.get("/", controllers_1.getGenres);
