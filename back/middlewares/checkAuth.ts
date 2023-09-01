import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import { AuthToken } from "../types/authToken.type";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    let validAuth = false;

    console.log("Check authentication");

    // Checking token
    try {
    // Verifying token
        const authToken = req.headers.authorization?.split(" ")[1] ?? "";
        const { id } = jwt.verify(authToken, String(process.env.TOKEN_KEY)) as AuthToken;

        // Checking in database
        const result = await userModel.findOne({ _id: id });

        // If an account has been found
        if (result) {
            // Check if account has been validated
            validAuth = result.status === "validated";

            if (!validAuth) console.log("Account not validated.");
            
        } else console.log("No Account has been found.");
    } catch (err) {
        console.log("An error occured while checking authentication.");
        console.log((err as Error).message);
    }

    // Grant access to route if valid authentication
    if (validAuth){
        console.log("Authentication succesful, access granted");
        next();
    }
    else res.status(401).send("Authentication failed");
};

export { checkAuth };
