import "./login.css";

import {Box, Container, Grid, Link, TextField, Typography} from "@mui/material";
import {Link as RouterLink, useNavigate} from "react-router-dom";

import {RoundedButton} from "../../components/rounded-button";
import userServiceInstance from "../../services/user.service";

export function Login(): JSX.Element {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        if (!email || !password) {
            return alert("Email et Mot de passe doivent être renseignés");
        }
        const token = await userServiceInstance.login(email.toString(), password.toString());
        sessionStorage.setItem("auth", String(token));
        navigate("/home");
    };

    const LoginForm = (): JSX.Element => (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            display={"flex"}
            flexDirection={"column"}
            sx={{my: 4, width: "100%"}}
        >
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Ton adresse email"
                name="email"
                autoComplete="email"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Ton mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
            />
            <RoundedButton type="submit" variant="contained" sx={{mt: 2, mb: 2}}>Se connecter</RoundedButton>
            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                        Mot de passe oublié?
                    </Link>
                </Grid>
                <Grid item>
                    <Link component={RouterLink} to="/register">
                        Pas de compte ? Inscris-toi
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <>
            <Container className="login-container">
                <Box
                    className="explore-heading"
                >
                    <Typography variant="h2">
                        Explore
                    </Typography>
                    <Typography variant="h2" sx={{fontWeight: "bolder", mb: 3}}>
                        La musique
                    </Typography>
                </Box>
            </Container>
            <Container maxWidth="md" sx={{mt: 2}}>
                <Typography align="center" variant="h4" sx={{mb: 1}}>
                    La symphonie de tes émotions à portée de clic
                </Typography>
                <Typography align="center" variant="h4">
                    Connecte-toi
                </Typography>
            </Container>
            <Container maxWidth="xs">
                <LoginForm/>
            </Container>
        </>
    );
}
