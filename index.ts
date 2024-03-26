import express, { json, Request, Response } from "express";
import cors from "cors";
import connectDB from "./src/config/db";
// import { albumRoutes, artistRoutes, genreRoutes, songRoutes } from "./src/routes/routes";
import path from 'path';
import { notFound } from "./src/middlewares/errorMiddleware";

import newRoutes from './src/routes/new.routes'

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname,"/index.html"));
});
// app.use('/songs', songRoutes);
// app.use('/albums', albumRoutes);
// app.use('/artists', artistRoutes);
// app.use('/genres', genreRoutes);


app.use('/api', newRoutes);

app.use(notFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`app running on port ${PORT}`);
})
