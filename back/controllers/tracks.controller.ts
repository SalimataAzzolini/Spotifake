import { Request, Response } from "express";
import { TrackModel } from "../models";
import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export async function getAllTracks(req: Request, res: Response) {
    const tracks = await TrackModel.find({});
    return res.status(200).json(tracks);
}

export async function getOneTrack(req: Request, res: Response) {
    const id = req.params.id;
    const track = await TrackModel.findById(id);
    return res.status(200).json(track);
}

export async function searchTrack(req: Request, res: Response) {
    return res.status(200).json({});
}

export async function playTrack(req: Request, res: Response) {
    const id = req.params.id;
    const track = await TrackModel.findById(id);

    if(!track) {
        return res.status(404).send({ msg: "track not found"});
    }

    const s3Client = new S3Client({ region: process.env.REGION });
    const bucketName = process.env.BUCKET;
    const filename = track?.file;

    try {
        const params = {
            Bucket: bucketName,
            Key: filename
        };
      
        const command = new GetObjectCommand(params);
        const s3Response = await s3Client.send(command);

        if (s3Response.Body instanceof Readable) {
            // Convert the stream to a buffer
            const chunks: any = [];
            for await (const chunk of s3Response.Body) {
                chunks.push(chunk);
            }
            const fileData = Buffer.concat(chunks);
      
            // Set the appropriate headers for the file
            res.setHeader("Content-Length", fileData.length);
            res.setHeader("Content-Type", s3Response.ContentType || "audio/mp3");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
            // Send the file data back to the client
            res.send(fileData);
        } else {
            throw new Error("Invalid file data");
        }
    } catch (error) {
        console.error("Error retrieving the file:", error);
    }
}
