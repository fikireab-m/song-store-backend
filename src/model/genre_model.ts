import { Schema, model } from "mongoose";

export interface IGenre {
    name: string;
}

const genreScheme = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Genre = model<IGenre>("Genre", genreScheme);
export default Genre;