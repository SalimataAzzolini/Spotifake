import {Request, Response} from "express";

import {AlbumModel} from "../models";

export async function getAllAlbums(req: Request, res: Response) {
    try {
        const albums = await AlbumModel.find({}).populate("tracks");
        res.status(200).json(albums);
    } catch (e) {
        res.status(400).json({message: "error"});
    }
}

export async function getOneAlbum(req: Request, res: Response) {
    const album = await AlbumModel.find();
    return res.status(200).json(album);
}

export async function searchAlbum(req: Request, res: Response) {
    const target = req.body;
    const album = await AlbumModel.findOne(target);

    return res.status(200).json(album);
}
