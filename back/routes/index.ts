import express from "express";
import usersRouter from "./user";
import albumsRouter from "./album";
import tracksRouter from "./track";
import playlistRouter from "./playlist";
import searchRouter from "./search";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/albums", albumsRouter);
router.use("/tracks", tracksRouter);
router.use("/playlists", playlistRouter);
router.use("/search", searchRouter);

export { router as apiRouter };
