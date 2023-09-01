import express from "express";
import {getAllAlbums, getOneAlbum, searchAlbum} from "../controllers/albums.controller";
import {valideSearch} from "../middlewares/checkInput";

const albumsRouter = express.Router();

albumsRouter.get("/", getAllAlbums);
albumsRouter.get("/:id", getOneAlbum);
albumsRouter.post("/search", valideSearch, searchAlbum);

export default albumsRouter;
