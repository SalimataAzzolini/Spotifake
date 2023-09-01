import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import userServiceInstance from "../../services/user.service";

const Validation = () => {
    const [ message, setMessage] = useState("");

    const search = useLocation().search;
    const token = new URLSearchParams(search).get("token");

    useEffect(() => {
        if(token){
            userServiceInstance.validateAccount(token)
                .then(() => setMessage("Ton compte a bien été validé, félicitations !"))
                .catch(() => setMessage("Ooops: une erreur est survenue !"));
        }   
    }, []);

    return(
        <Container sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            {message ?
                <>
                    <Typography variant="h4" sx={{margin: "1rem"}}>
                        { message }
                    </Typography>
                    <Link to="/login">Connecte toi !</Link>
                </> :
                <CircularProgress />
            }
        </Container>
    );
};

export { Validation };
