import { Box } from "@mui/material";

const PageNotFound = () => {
    return(
        <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            fontSize={"20px"}
        >
            <div>
                <h2>Erreur 404</h2>
                <p>Seul Chuck Norris peut trouver cette page.</p>
            </div>
        </Box>
    );
};

export { PageNotFound };
