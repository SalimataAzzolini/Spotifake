import { Track } from "./tracks.service.type";

export interface IPlaylist {
    _id : string;
    name : string;
    tracks : Track[];
    userId : string;
}
