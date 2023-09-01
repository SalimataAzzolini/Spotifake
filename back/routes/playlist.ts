import {
    addTrackToPlaylist,
    createPlaylist,
    deletePlaylist,
    deleteTrackFromPlaylist,
    getAllPlaylists,
    getOnePlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller";

import express from "express";
import {validateAddTrackToPlaylist, validateCreatePlaylist, validateUpdatePlaylist} from "../middlewares/checkInput";

const playlistRouter = express.Router();

playlistRouter.get("/:userId", getAllPlaylists);
playlistRouter.get("/:userId/:playlistId", getOnePlaylist);
playlistRouter.post("/:userId/create", validateCreatePlaylist, createPlaylist);
playlistRouter.post("/:userId/:playlistId", validateAddTrackToPlaylist, addTrackToPlaylist);
playlistRouter.delete("/:userId/:trackId/:playlistId", deleteTrackFromPlaylist);
playlistRouter.put("/:userId/:playlistId", validateUpdatePlaylist, updatePlaylist);
playlistRouter.delete("/:userId/:playlistId", deletePlaylist);

export default playlistRouter;
