import {check, ValidationChain, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export function checkUserLogin(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("email", "Email is required and must be a valid email address").notEmpty(),
        check(
            "password",
            "Password is required and must be at least 8 characters long with " +
            "at least one lowercase letter, one uppercase letter, two numbers, and one symbol"
        )
            .notEmpty()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 2,
                minSymbols: 1,
            }),
    ])(req, res, next);

}

export function checkUserRegister(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("email", "Email is required and must be a valid email address").notEmpty().isEmail(),
        check(
            "password",
            "Password is required and must be at least 8 characters long with" +
            " at least one lowercase letter, one uppercase letter, two numbers, and one symbol"
        )
            .notEmpty()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 2,
                minSymbols: 1,
            }),
        check("firstname", "The 'firstname field is required and must be a non-empty string").isLength({
            min: 3,
            max: 30
        }),
        check("lastname", "The 'lastname field is required and must be a non-empty string").isLength({
            min: 3,
            max: 30
        }),

    ])(req, res, next);
}

export function validateAccountInfoUpdate(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("email", "Email is required and must be a valid email address").optional().isEmail(),
        check(
            "password",
            "Password is required and must be at least 8 characters long with" +
            " at least one lowercase letter, one uppercase letter, two numbers, and one symbol"
        )
            .optional()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 2,
                minSymbols: 1,
            }),
        check("firstname", "The 'firstname field is required and must be a non-empty string").optional().isLength({
            min: 3,
            max: 30
        }),
        check("lastname", "The 'lastname field is required and must be a non-empty string").optional().isLength({
            min: 3,
            max: 30
        })

    ])(req, res, next);
}

export function validateCreatePlaylist(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("userId", "userId is required and must be a valid int ").notEmpty(),
    ])(req, res, next);
}

export function validateAddTrackToPlaylist(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("userId", "userId is required and must be a valid int ").notEmpty(),
        check("playlistId", "playlistId is required and must be a valid int ").notEmpty(),
        check("trackId", "trackId is required and must be a valid int ").notEmpty(),
    ])(req, res, next);
}

export function validateUpdatePlaylist(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("userId", "userId is required and must be a valid int ").notEmpty(),
        check("playlistId", "playlistId is required and must be a valid int ").notEmpty(),
        check("name").notEmpty()
    ])(req, res, next);
}

export function valideSearchTrack(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("track", "Track is required and must be a valid string")

    ])(req, res, next);
}

export function valideSearch(req: Request, res: Response, next: NextFunction) {
    return validate([
        check("searchTerm", "Track is required and must be a valid string").optional(),
        check("title", "Title is required and must a valid string").optional()

    ])(req, res, next);
}

const validate = (validations: Array<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Create a new array with duplicates removed
        const uniqueErrors = Array.from(new Set(errors.array().map(error => JSON.stringify(error))))
            .map(error => JSON.parse(error));
        res.status(400).json(uniqueErrors);

    };
};
