import { Container, Divider, Typography } from "@mui/material";
import "./footer.css";

export const Footer = (): JSX.Element => {
    return (<div
        className="footer-wrapper"
    >
        <Container
            maxWidth="sm"
            id="footer-container"
        >
            <Divider id="join-divider">
                <Typography variant="h5">REJOINS-NOUS</Typography>
            </Divider>

        </Container>
    </div>);
};
