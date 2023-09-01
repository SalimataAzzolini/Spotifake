import axios from "axios";
import { Track } from "./tracks.service.type";

class TracksService {
    static async getAllTracks(): Promise<Track[]> {
        const res = await axios.get("http://localhost:3000/api/tracks");
        return res.data;
    }
}

export { TracksService };
