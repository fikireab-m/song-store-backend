import mongoose, { Schema, Document } from "mongoose";

interface SongInterface extends Document {
  title: string;
  artist: { fname: string; lname: string; avatarUrl?: string };
  album: { name: string; albumArt?: string };
  genre: string;
}

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    artist: {
      fname: {
        type: String,
        required: [true, "First name is required"],
      },
      lname: {
        type: String,
        required: [true, "Last name is required"],
      },
      avatarUrl: {
        type: String,
        default: "",
      },
    },
    album: {
      name: {
        type: String,
        required: [true, "Album name is required"],
      },
      albumArt: {
        type: String,
        default: "",
      },
    },
    genere: {
      type: String,
      required: [true, "Genere is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model<SongInterface>("Song", songSchema);
export default Song;
