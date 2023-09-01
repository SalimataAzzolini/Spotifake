import axios from "axios";
import { SearchResult } from "./search.type";

export class SearchService {
   
    static async search(searchTerm : string): Promise<SearchResult> {
        const res = await axios.get(`http://localhost:3000/api/search?searchTerm=${searchTerm}`);
        return res.data;
    }
}
