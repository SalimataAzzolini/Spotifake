import { Document, Model, Schema, model } from "mongoose";

export interface ITrack extends Document {
    title: string;
    duration: string;
    file: string;
  }

export const trackSchema = new Schema<ITrack>({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    file: { type: String, required: true },
});

const TrackModel: Model<ITrack> = model<ITrack>("Track", trackSchema);
export { TrackModel };
