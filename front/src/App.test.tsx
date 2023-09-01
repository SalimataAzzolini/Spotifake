import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

describe("App component test", () => {
    const TestComponent = () => {
        return (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
    };

    it("Component should rendering", () => {
        render(<TestComponent />);
    });
});
