import express from "express";
const router = express.Router();
import { addSong, getSong, getSongs } from "./songControllers";

router
.get("/", getSongs)
.get("/:id", getSong)
.post("/add", addSong);

export default router;
