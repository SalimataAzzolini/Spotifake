import express from "express";
import {getAllTracks, getOneTrack, playTrack, searchTrack} from "../controllers/tracks.controller";
import {valideSearchTrack} from "../middlewares/checkInput";

const tracksRouter = express.Router();

tracksRouter.get("/", getAllTracks);
tracksRouter.get("/:id", getOneTrack);
tracksRouter.get("/:id/play", playTrack);
tracksRouter.post("/search", valideSearchTrack, searchTrack);

export default tracksRouter;
