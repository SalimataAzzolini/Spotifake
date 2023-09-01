import express from "express";
import logger from "morgan";
import { apiRouter } from "./routes";
import cors from "cors";

const app = express();
const environment = process.env.NODE_ENV || "development";

// Enables CORS
if (environment === "development") {
    app.use(cors({ origin: true, credentials: true })); 
}

app.use(logger("dev"));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.use("/api", apiRouter);

// Any other route
app.use("/", (req, res) =>
    res.status(404).json({ answer: "Ressource not found." })
);

export default app;
