import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

export const NavBar = (): JSX.Element => {
    return (
        <Box sx={{ mb: 3 }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        SPOTIFAKE
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
