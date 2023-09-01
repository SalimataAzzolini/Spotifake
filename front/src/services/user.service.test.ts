import axios from "axios";
import { vi } from "vitest";

import userServiceInstance from "./user.service";

describe("user.service.ts test", () => {
    describe("login method", () => {
        it("Should succeed",async () => {
            axios.post = vi.fn().mockResolvedValueOnce({data: "thisIsAToken"});

            const res = await userServiceInstance.login("john.doe@mock.com","1234abcd");
        
            expect(res).toBe("thisIsAToken");

        });
    });

    describe("register method", () => {
        it("Should succeed", async () => {
            axios.post = vi.fn().mockResolvedValueOnce(true);

            let res;
            try{
                res = await userServiceInstance.register({
                    email: "john.doe@mock",
                    password: "123abcd"
                });
            }
            catch(err){
                res = err;
            }

            expect(res).toBeTruthy();
        });

        test("Should fail", async () => {
            axios.post = vi.fn().mockRejectedValueOnce(false);

            let res;
            try{
                res = await userServiceInstance.register({
                    email: "john.doe@mock",
                    password: "123abcd"
                });
            }
            catch(err){
                res = err;
            }

            expect(res).toBeFalsy();
        });
    });

    describe("validate account method", () => {
        it("Should succeed", async () => {
            axios.post = vi.fn().mockResolvedValueOnce(undefined);

            const res = await userServiceInstance.validateAccount("token");

            console.log(res);

            expect(res).toBeUndefined();
        });
    });

    describe("getProfileInfo method failure", () => {

        it("Should succeed", async () => {
            axios.get = vi.fn().mockResolvedValueOnce({
                data:{
                    email: "john.doe@mock",
                    firstname: "John",
                    lastName: "Doe"
                }
            });

            let res;
            try{
                res = await userServiceInstance.getProfileInfo("token");
            }
            catch(err){
                res = err;
            }
        
            expect(res).toStrictEqual({
                email: "john.doe@mock",
                firstname: "John",
                lastName: "Doe"
            });
        });

        it("Should fail", async () => {
            axios.get = vi.fn().mockRejectedValueOnce("This is an error");
        
            let res;
            try{
                res = await userServiceInstance.getProfileInfo("token");
            }
            catch(err){
                res = err;
            }

            expect(res).toBe("This is an error");
        });
        
    });

    describe("updateProfileInfo method : no change", () => {
        it("Should succeed", async () => {
            axios.put = vi.fn().mockResolvedValueOnce("success");
        
            let res;
            try {
                res = await userServiceInstance.updateProfileInfo("token", {
                    firstname:"Wayne"
                });
            }
            catch(err){
                res = err;
            }

            expect(res).toStrictEqual({});

        });
        
        it("Should response : no change", async () => {
            axios.put = vi.fn().mockRejectedValueOnce({
                response:{
                    status: 304
                }
            });
        
            let res;
            try {
                res = await userServiceInstance.updateProfileInfo("token", {
                    firstname:"Wayne"
                });
            }
            catch(err){
                res = err;
            }

            expect(res).toStrictEqual({message: "Aucune modification effectuée",color: "orange"});

        });

        it("Should fail", async () => {
            axios.put = vi.fn().mockRejectedValueOnce({
                response:{
                    status: 304
                }
            });
        
            let res;
            try {
                res = await userServiceInstance.updateProfileInfo("token", {
                    firstname:"Wayne"
                });
            }
            catch(err){
                res = err;
            }

            expect(res).toStrictEqual({message: "Aucune modification effectuée",color: "orange"});

        });
    });

    describe("deleteAccount method", () => {
        it("Should succeed", async () => {
            axios.delete = vi.fn().mockResolvedValue("success");

            let res;
            try {
                res = await userServiceInstance.deleteAccount("token");
            }
            catch(err){
                res = err;
            }

            expect(res).toBeTruthy();
        });

        it("Should succeed", async () => {
            axios.delete = vi.fn().mockRejectedValue("failure");

            let res;
            try {
                res = await userServiceInstance.deleteAccount("token");
            }
            catch(err){
                res = err;
            }

            expect(res).toBeFalsy();
        });
    });

    describe("checkAuthentication method", () => {
        it("Should succeed", async () => {
            axios.get = vi.fn().mockResolvedValueOnce("success");

            let res;

            try{
                res = await userServiceInstance.checkAuthentication();
            }
            catch(err){
                res = err;
            }

            expect(res).toBeTruthy();
        });

        it("Should fail", async () => {
            axios.get = vi.fn().mockRejectedValueOnce("failure");

            let res;

            try{
                res = await userServiceInstance.checkAuthentication();
            }
            catch(err){
                res = err;
            }

            expect(res).toBeFalsy();
        });
    });
});
