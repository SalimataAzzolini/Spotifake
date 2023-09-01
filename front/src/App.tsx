import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material";
import { NavBar, Footer } from "./layout";
import { Router } from "./router";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <NavBar />
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Router />
            </Box>
            <Footer />
        </ThemeProvider>
    );
}

export default App;
