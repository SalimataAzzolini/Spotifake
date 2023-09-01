import mongoose, { Document, Model, Schema, model } from "mongoose";
import { ITrack } from "./track.model";

interface IAlbum extends Document {
    title: string;
    artist: string;
    year: string;
    description: string;
    styles: string[];
    tracks: ITrack[];
}

const albumSchema = new Schema<IAlbum>({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    styles: { type: [String], required: true },
    tracks: { type: [mongoose.Schema.Types.ObjectId], ref: "Track" , required: true },
});
  
const AlbumModel: Model<IAlbum> = model<IAlbum>("Album", albumSchema);

export { AlbumModel };
