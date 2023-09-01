import { ITrack, IUser, PlaylistModel } from "../models";
import { Request, Response } from "express";

export async function getAllPlaylists(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlists = await PlaylistModel.find({ user: userId }).populate("tracks");
    return res.status(200).json(playlists);
}

export async function getOnePlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistId = req.params.playlistId; 
    const playlist = await PlaylistModel.findOne({ _id: playlistId, user: userId });
    return res.status(200).json(playlist);
}

export async function createPlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistData = { ...req.body, user: userId };
    const playlist = await PlaylistModel.create(playlistData);
    return res.status(201).json(playlist);
}

export async function addTrackToPlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistId = req.params.playlistId; 
    const trackId = req.body.trackId;
    const playlist = await PlaylistModel.findOne({ _id: playlistId, user: userId }).populate("tracks");

    if (playlist) {
        playlist.tracks.push(trackId);
        await playlist.save();
        return res.status(200).json(playlist);
    } else {
        return res.status(404).json({ error: "Playlist not found" });
    }
}

export async function deleteTrackFromPlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistId = req.params.playlistId; 
    const trackId = req.body.trackId;
    const playlist = await PlaylistModel.findOne({ _id: playlistId, user: userId });

    if (playlist) {
        const updatedTracks = playlist.tracks.filter((track: ITrack) => track._id.toString() !== trackId);
        playlist.tracks = updatedTracks;
        await playlist.save();
        return res.status(200).json(playlist);
    } else {
        return res.status(404).json({ error: "Playlist not found" });
    }
}

export async function updatePlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistId = req.params.playlistId; 
    const playlist = await PlaylistModel.findOne({ _id: playlistId, user: userId });
    if (playlist) {
        playlist.name = req.body.name;
        await playlist.save();
        return res.status(200).json(playlist);
    } else {
        return res.status(404).json({ error: "Playlist not found" });
    }
}

export async function deletePlaylist(req: Request, res: Response) {
    const userId = req.params.userId; 
    const playlistId = req.params.playlistId; 
    try {

        const playlist = await PlaylistModel.findOneAndDelete({ _id: playlistId, user: userId }).exec();
        return res.status(200).json(playlist);
    } catch (e){
        console.error(e);
    }
}
