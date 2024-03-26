import { Schema, model } from "mongoose";

export interface SongInterface {
  title: string;
  artistId: Schema.Types.ObjectId;
  albumId: Schema.Types.ObjectId;
  genreId: Schema.Types.ObjectId;
}

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    artistId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    albumId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    genreId: {
      type: Schema.Types.ObjectId,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Song = model<SongInterface>("Song", songSchema);
export default Song;
