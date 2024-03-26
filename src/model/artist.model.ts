import { Schema, model } from "mongoose";

export interface IArtist {
    fname: String;
    lname: String;
    avatar?: String;
}

const artistSchema = new Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:""
    },
},
{
    timestamps:true
});

const Artist = model<IArtist>("Artist",artistSchema);
export default Artist;