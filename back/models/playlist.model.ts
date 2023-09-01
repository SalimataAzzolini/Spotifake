import mongoose, { Document, Model, Schema, model } from "mongoose";

import { ITrack, } from "./track.model";
import {IUser} from "./user.model";

interface IPlaylist extends Document {
    name: string;
    tracks: ITrack[];
    user : IUser;

}

const playlistSchema = new Schema<IPlaylist>({
    name: { type: String, required: true },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const PlaylistModel: Model<IPlaylist> = model<IPlaylist>("Playlist", playlistSchema);

export { PlaylistModel };
