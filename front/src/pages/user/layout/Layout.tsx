import { Outlet } from "react-router-dom";
import Header from "../../../components/user/header/Header";
import { Container } from "@mui/material";

const LoggedInLayout = () => {
    return (
        <Container maxWidth="xl" sx={{ display: "flex", flex: 1, flexDirection: "column" , alignItems: "center"}}>
            <Header/>
            <Outlet/>
        </Container>
    );
};

export { LoggedInLayout };
