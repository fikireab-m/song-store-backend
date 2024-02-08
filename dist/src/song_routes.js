"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const songControllers_1 = require("./songControllers");
router
    .get("/", songControllers_1.getSongs)
    .get("/:id", songControllers_1.getSong)
    .post("/add", songControllers_1.addSong);
exports.default = router;
