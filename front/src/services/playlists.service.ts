import { IPlaylist } from "./playlists.service.type";
import axios from "axios";
import { jwtUtil } from "../utils/jwt-util";

class PlaylistsService {
    static async getAllPlaylists(): Promise<IPlaylist[]> {
        const userId = jwtUtil();
        const res = await axios.get(`http://localhost:3000/api/playlists/${userId}`);
        return res.data;
    }

    static async getPlaylistById(id: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.get(`http://localhost:3000/api/playlists/${userId}/${id}`);
        return res.data;
    }

    static async createPlaylist(name: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.post(`http://localhost:3000/api/playlists/${userId}/create`, 
            { name: name });
        return res.data;
    }

    static async addTrackToPlaylist(playlistId: string, trackId: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.post(`http://localhost:3000/api/playlists/${userId}/${playlistId}`, 
            { trackId: trackId });
        return res.data;
    }

    static async deleteTrackFromPlaylist(trackId: string, playlistId: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.delete(`http://localhost:3000/api/playlists/${userId}/${trackId}/${playlistId}`, 
            { data: { trackId: trackId } });
        return res.data;
    }

    static async updatePlaylist(playlistId: string, name: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.put(`http://localhost:3000/api/playlists/${userId}/${playlistId}`, 
            { name: name });
        return res.data;
    }

    static async deletePlaylist(playlistId: string): Promise<IPlaylist> {
        const userId = jwtUtil();
        const res = await axios.delete(`http://localhost:3000/api/playlists/${userId}/${playlistId}`);
        return res.data;
    }

}

export { PlaylistsService };
