import {AlbumType, Track} from "./albums.service.type";

export interface SearchResult {
    albums: AlbumType[];
    tracks: Track[];
}
