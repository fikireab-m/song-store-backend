import express, { json, urlencoded, Request, Response } from "express";
import cors from "cors";
import connectDB from "./src/config/db";
import songRoutes from "./src/song_routes"

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Songs API root");
});
app.use('/songs', songRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`app running on port ${PORT}`);
})
