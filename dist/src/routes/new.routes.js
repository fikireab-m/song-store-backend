"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers/controllers");
const router = (0, express_1.Router)();
router.route("/")
    .post(controllers_1.addSong)
    .get(controllers_1.searchSongs);
exports.default = router;
