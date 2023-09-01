import userModel from "../models/user.model";
import type { Request, Response } from"express";
import { 
    loginUser,
    registerUser,
    validateAccount,
    getAccountInfo,
    updateAccountInfo,
    deleteAccount,
    checkAuthenticated
} from "./users.controller";
import { sendValidationMail } from "../utils/mailer";
import jwt from "jsonwebtoken";

/**
 * Mocking
 */
// Mocking model.findOne method (once per test)
type ReqFindOneBody = {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    comparePassword: () => boolean;
} | undefined

const mockFindOneOnce = (body: Partial<ReqFindOneBody>) => {
    return jest.fn().mockResolvedValueOnce(body);
};

// Mocking model.function with resolve/reject method (once per test)
const mockFunctionOnce = (success: boolean) => {
    if(success )
        return jest.fn().mockResolvedValueOnce("success");
    else{
        return jest.fn().mockRejectedValueOnce("error");
    }
};

// Set authorization in reques
const setAuthorization = (req: Request) => {
    const token = jwt.sign({id: "this an id"}, "THE KEY");

    req.headers = {
        authorization: `bearer ${token}`
    };

};

// Mocking thirdparts functions
jest.mock("../utils/mailer",() => ({
    sendValidationMail: jest.fn().mockResolvedValue("Email sent"),
}));

/**
 * user controller test
 */
describe("users controller test", () => {

    // Mocking request
    const req: Request = {
        body:{}
    } as Request;

    // mocking response
    const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    } as Partial<Response>;
    const res: Response = mockResponse as Response;

    /**
     * Login Controller
     */
    describe("login method test" , () => {
        // Mocking model.findOne
        userModel.findOne = mockFindOneOnce({
            email: "john.doe@mock.com",
            password: "hashpwd",
            comparePassword: jest.fn().mockResolvedValue(true)
        });

        req.body = {
            email: "john.doe@mock.com",
            password: "1234Abcd!"
        };

        it("should fail with wrong login", async () => {
            // Mocking model.findOne
            userModel.findOne = mockFindOneOnce(undefined);
            
            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            // TODO wait JWT Token generation in controller
            expect(res.send).toHaveBeenCalledWith({ message: "Wrong email or password" });
        });

        it("should fail with wrong password", async () => {
            // Mocking model.findOne
            userModel.findOne = mockFindOneOnce({
                email: "john.doe@mock.com",
                password: "hashpwd",
                comparePassword: jest.fn().mockResolvedValue(false)
            });

            // Request
            req.body.password = "wrong_password";
            
            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            // TODO wait JWT Token generation in controller
            expect(res.send).toHaveBeenCalledWith({ message: "Wrong email or password" });
        });

        it("should response valid login response", async () => {
            // Mocking model.findOne
            userModel.findOne = mockFindOneOnce({
                email: "john.doe@mock.com",
                password: "hashpwd",
                comparePassword: jest.fn().mockResolvedValue(true)
            });

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            // TODO wait JWT Token generation in controller
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    });

    /**
     * Register user
     */
    describe("Register controller test", () => {

        it("Should fail if model.validate fail (ex: missing property)", async () => {
            userModel.prototype.validate = mockFunctionOnce(false);
            userModel.prototype.save = mockFunctionOnce(true);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "An error occured." });
            expect(sendValidationMail).not.toHaveBeenCalled();
        });

        it("Should fail if model.save fail (ex: duplicate email key)", async () => {
            userModel.prototype.validate = mockFunctionOnce(true);
            userModel.prototype.save = mockFunctionOnce(false);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "An error occured." });
            expect(sendValidationMail).not.toHaveBeenCalled();
        });

        it("Should register one user", async () => {
            userModel.validate = mockFunctionOnce(true);
            userModel.prototype.save = mockFunctionOnce(true);

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ message: "OK" });
            expect(sendValidationMail).toHaveBeenCalled();
        });

    });

    describe("Validate account controller test", () => {
        userModel.updateOne = mockFunctionOnce(true);

        it("should send response", async () => {
            await validateAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith();
        });
    });

    describe("getAccountInfo controller test", () => {
        setAuthorization(req);

        it("Should return account info", async () => {
            userModel.findOne = mockFindOneOnce({
                email: "john.doe@mock.com",
                firstname: "John",
                lastname: "Doe",
            });

            await getAccountInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                email: "john.doe@mock.com",
                firstname: "John",
                lastname: "Doe",
            });
        });

        it("Should error if no account found", async () => {
            userModel.findOne = mockFunctionOnce(false);

            await getAccountInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("No data found.");
        });

    });

    describe("updateAccountInfo controller test", () => {
        setAuthorization(req);

        it("Should update account", async () => {
            userModel.updateOne = mockFunctionOnce(true);

            await updateAccountInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith();
        });

        it("Should has found account with no update", async () => {
            userModel.updateOne = jest.fn().mockResolvedValueOnce({
                modifiedCount: 0 
            });

            await updateAccountInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(304);
            expect(res.send).toHaveBeenCalledWith("Not modified");

        });

        it("Should send status 500 on error", async () => {
            userModel.updateOne = mockFunctionOnce(false);

            await updateAccountInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("An error occured");
        });
    });

    describe("deleteAccount controller test", () => {

        it("Shoud has delete account", async () => {
            userModel.deleteOne = mockFunctionOnce(true);

            await deleteAccount(req, res);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledWith();
        });

        it("Shoud send status 500 on error", async () => {
            userModel.deleteOne = mockFunctionOnce(false);

            await deleteAccount(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("An error occured");
        });
    });

    describe("checkAuthenticated controller test", () => {
        it("Should send OK", async () => {
            await checkAuthenticated(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                authenticated: true,
            });
        });
    });
});
