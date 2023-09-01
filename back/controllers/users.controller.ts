import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import {sendValidationMail} from "../utils/mailer";
import {AuthToken} from "../types/authToken.type";

export async function loginUser(req: Request, res: Response) {

    const errorMessage = "Wrong email or password";
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    if (!user) {
        return res.status(400).send({message: errorMessage});
    }

    const isMatching = await user.comparePassword(password);
    if (!isMatching) {
        return res.status(400).send({message: errorMessage});
    }

    const token = jwt.sign({id: user._id}, String(process.env.TOKEN_KEY));

    return res.status(200).send(token);
}

export async function registerUser(req: Request, res: Response) {
    const validationToken = jwt.sign({email: req.body.email}, String(process.env.TOKEN_KEY));

    const newUser = new userModel({
        ...req.body,
        status: validationToken,
    });

    try {
        // Check new User vailidity
        await newUser.validate();

        // Store new User
        await newUser.save();

        // Send validation mail
        await sendValidationMail(newUser.email, newUser.lastname, validationToken);

        return res.status(201).send({message: "OK"});
    } catch (err) {
        return res.status(400).send({message: "An error occured."});
    }
}

export async function validateAccount(req: Request, res: Response) {

    await userModel.updateOne(
        {status: req.body.token},
        {status: "validated"}
    );

    res.status(204).send();
}

export async function getAccountInfo(req: Request, res: Response) {
    const id = decodeAuthToken(req);

    try {
        const profileInfo = await userModel.findOne({_id: id});
        return res.status(200).send({
            email: profileInfo?.email,
            firstname: profileInfo?.firstname,
            lastname: profileInfo?.lastname,
        });
    } catch (err) {
        res.status(500).send("No data found.");
    }

}

export async function updateAccountInfo(req: Request, res: Response) {
    const id = decodeAuthToken(req);

    try {
        const result = await userModel.updateOne({_id: id}, req.body);

        if (result.modifiedCount > 0)
            return res.status(204).send();

        res.status(304).send("Not modified");
    } catch (err) {
        res.status(500).send("An error occured");
    }
}

export async function deleteAccount(req: Request, res: Response) {
    const id = decodeAuthToken(req);

    try {
        await userModel.deleteOne({_id: id});
        res.status(204).send();
    } catch (err) {
        res.status(500).send("An error occured");
    }
}

export function checkAuthenticated(req: Request, res: Response) {
    res.status(200).send({
        authenticated: true,
    });
}

function decodeAuthToken(req: Request): string {

    const token = req.headers.authorization?.split(" ")[1];
    const {id} = jwt.decode(String(token)) as AuthToken;

    return id;
}
