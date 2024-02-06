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
        default: "https://icon-library.com/images/generic-person-icon/generic-person-icon-1.jpg",
      },
    },
    album: {
      name: {
        type: String,
        required: [true, "Album name is required"],
      },
      albumArt: {
        type: String,
        default: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },
    genre: {
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
