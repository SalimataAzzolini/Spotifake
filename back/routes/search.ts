import express from "express";
import {AlbumModel} from "../models/album.model";
import {TrackModel} from "../models/track.model";
import {valideSearch} from "../middlewares/checkInput";

const searchRouter = express.Router();

searchRouter.get("/", valideSearch, async (req, res) => {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) return res.status(200).json({albums: [], tracks: []});
    try {
        const albums = await AlbumModel.find({
            $or: [
                {title: {$regex: searchTerm, $options: "i"}},
                {artist: {$regex: searchTerm, $options: "i"}},
            ],
        }).populate("tracks");
        const trackIds = albums.map((album) => album.tracks).flat().map((track) => track._id);
        console.log(trackIds);
        const tracks = await TrackModel.find({
            _id: {$nin: trackIds},
            $or: [
                {title: {$regex: searchTerm, $options: "i"}},
            ],
        });

        res.json({albums, tracks});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "An error occurred"});
    }
});

export default searchRouter;
