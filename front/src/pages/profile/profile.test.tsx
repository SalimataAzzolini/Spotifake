import { act, render, screen } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";
import { Profile } from "./profile";
import userEvent from "@testing-library/user-event";
import userServiceInstance from "../../services/user.service";
import { vi } from "vitest";

describe("Profile page test", () => {

    it("Should be defined",() => {
        expect(Profile).toBeDefined();
    });

    it("Should render", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockResolvedValueOnce(true);

        userServiceInstance.getProfileInfo = vi.fn().mockResolvedValueOnce({
            email: "john.doe@mock.com",
            firstname: "John",
            lastname: "Doe"
        });
        
        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });

        // Page Title
        expect(screen.getByText("TES INFOS")).toBeDefined();

        // Form fields

        expect(screen.getByText("Nom")).toBeDefined();
        expect(screen.getByText("Prénom")).toBeDefined();
        expect(screen.getByText("Email")).toBeDefined();
        expect(screen.getByText("Mot de passe")).toBeDefined();

        const fieldsList = screen.getAllByRole("textbox");

        expect(fieldsList.length).toBe(3);

        expect(screen.getAllByPlaceholderText("John").length).toBe(1);
        expect(screen.getAllByPlaceholderText("Doe").length).toBe(1);
        expect(screen.getAllByPlaceholderText("john.doe@mock.com").length).toBe(1);
        expect(screen.getAllByPlaceholderText("mot de passe").length).toBe(1);

        // Buttons
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBe(2);

        expect(screen.getByText("Modifier mes infos")).toBeDefined();
        expect(screen.getByText("Supprimer le compte")).toBeDefined();

        // Links
        expect(screen.getAllByRole("link").length).toBe(1);

    });

    it("Should display circularProgress", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockRejectedValueOnce(false);

        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });

        expect(screen.getByRole("img")).toBeDefined();

    });

    it("Should display modals on delete account request", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockResolvedValueOnce(true);
        
        userServiceInstance.getProfileInfo = vi.fn().mockResolvedValueOnce({
            email: "john.doe@mock.com",
            firstname: "John",
            lastname: "Doe"
        });

        userServiceInstance.deleteAccount = vi.fn().mockResolvedValueOnce(true);

        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });

        await userEvent.click(screen.getByText("Supprimer le compte"));

        expect(screen.getByText("Ne nous quittes pas,")).toBeDefined();
        expect(
            screen.getByText("Nous t'offrirons des perles de pluies venues de pays où il ne pleut pas !")
        ).toBeDefined();

        expect(screen.getByText("Ok ! J'ai la ref.")).toBeDefined();
        const deleteButton = screen.getByText("Si ! Spotify c'est mieux.");
        expect(deleteButton).toBeDefined();

        await userEvent.click(deleteButton);
        
        expect(screen.getByText("La compte a bien été supprimé.")).toBeDefined();
        expect(screen.getByText("Retour")).toBeDefined();
    });

    it("Should prompt an error message on getProfileInfo fail", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockResolvedValueOnce(true);

        userServiceInstance.getProfileInfo = vi.fn().mockRejectedValueOnce("error");

        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });

        expect(screen.getByText("Nous n'avons pas pu afficher les informations du compte.")).toBeDefined();
    });

    it("Should not call updateProfile if all fields are empty", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockResolvedValueOnce(true);
        
        userServiceInstance.getProfileInfo = vi.fn().mockResolvedValueOnce({
            email: "john.doe@mock.com",
            firstname: "John",
            lastname: "Doe"
        });

        userServiceInstance.updateProfileInfo = vi.fn();

        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });
        
        await userEvent.click(screen.getByText("Modifier mes infos"));

        expect(userServiceInstance.updateProfileInfo).not.toHaveBeenCalled();
    });

    it("Should call updateProfile", async () => {
        // Mock backend requests
        userServiceInstance.checkAuthentication = vi.fn().mockResolvedValueOnce(true);
        
        userServiceInstance.getProfileInfo = vi.fn().mockResolvedValueOnce({
            email: "john.doe@mock.com",
            firstname: "John",
            lastname: "Doe"
        });

        userServiceInstance.updateProfileInfo = vi.fn().mockResolvedValueOnce({
            email: "john.doe@mock.com",
            firstname: "Wayne",
            lastname: "Doe"
        });

        // Component Rendering
        await act(async() => {
            render(
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            );
        });
        
        const nameInput = screen.getByPlaceholderText("Doe");

        await userEvent.type(nameInput, "Wayne");

        await userEvent.click(screen.getByText("Modifier mes infos"));

        expect(userServiceInstance.updateProfileInfo).toHaveBeenCalledWith(null, {lastname: "Wayne"});

        expect(screen.getByPlaceholderText("Wayne")).toBeDefined();
    });
});
