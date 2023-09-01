import fs from "fs";
import { AlbumModel, TrackModel } from "../models";

const filePath = "assets/watchbase.json";

export async function seedDatabase() {
    const albumCount = await AlbumModel.count({});
    const trackCount = await TrackModel.count({});

    // Database is already populated, return early
    if(albumCount > 0 && trackCount > 0) {
        return Promise.resolve();
    }

    console.log("🌱 Seeding database... ");
    fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
            console.error("Error reading the JSON file:", err);
            return;
        }
    
        try {
            const jsonDb = JSON.parse(data);
            for(const album of jsonDb.albums) {
                const { title, artist, year, description, styles, tracks } = album;
                const insertedTracks = await TrackModel.insertMany(tracks);
                await AlbumModel.create({
                    title,
                    artist,
                    year,
                    description,
                    styles,
                    tracks: insertedTracks.map(t => t._id)
                });
            }
            console.log("🌱 Seeding database done ✅");
        // You can work with the parsed JSON data here
        } catch (error) {
            console.error("Error parsing the JSON file:", error);
        }
    });
}
