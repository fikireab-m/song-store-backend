import { Schema,model } from "mongoose";

export interface IAlbum {
    name: string;
    art?: string;
}

const albumSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    art:{
        type:String,
        default:""
    }
},
{
    timestamps:true
});

const Album = model<IAlbum>("Album", albumSchema);
export default Album;