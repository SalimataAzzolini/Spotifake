import {AlbumType} from "./albums.service.type";
import axios from "axios";

class AlbumsService {

    static async getAllAlbums(): Promise<AlbumType[]> {
        try {
            const res = await axios.get("http://localhost:3000/api/albums/");
            return res.data;
        } catch (error) {
            throw new Error("Failed to fetch albums");
        }
    }

    static async searchedAlbum(): Promise<AlbumType[]> {
        const res = await axios.post("http://localhost:3000/api/albums/");
        return res.data;
    }
}

export default AlbumsService;
