import express from "express";
import {checkAuth} from "../middlewares/checkAuth";

import {
    checkAuthenticated,
    deleteAccount,
    getAccountInfo,
    loginUser,
    registerUser,
    updateAccountInfo,
    validateAccount
} from "../controllers/users.controller";
import {checkUserLogin, checkUserRegister, validateAccountInfoUpdate} from "../middlewares/checkInput";

const usersRouter = express.Router();

usersRouter.post("/login", checkUserLogin, loginUser);
usersRouter.post("/register", checkUserRegister, registerUser);
usersRouter.post("/validate", validateAccount);

// Routes requiring authentication.
usersRouter.use(checkAuth);

usersRouter.get("/profile", getAccountInfo);
usersRouter.put("/update-account", validateAccountInfoUpdate, updateAccountInfo);
usersRouter.delete("/delete-account", deleteAccount);
usersRouter.get("/check-authentication", checkAuthenticated);

export default usersRouter;
