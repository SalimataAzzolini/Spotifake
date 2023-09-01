import { useEffect, useState } from "react";
import { Box, Container, TextField, Typography, CircularProgress, LinearProgress  } from "@mui/material";
import { Link } from "react-router-dom";
import { RoundedButton } from "../../components/rounded-button";
import { type UserData } from "../../services/user.service.type";
import userServiceInstance from "../../services/user.service";

const sandglassImageUrl = new URL(
    "../../assets/cover-sandglass.png",
    import.meta.url
).href;

export const Register = (): JSX.Element => {
    // State
    const [isRequesting, setIsRequesting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isRequestSuccess, setIsRequestSuccess] = useState(false);

    useEffect(() => {
        if (errorMessage) setIsRequesting(false);
    }, [errorMessage]);

    // Handlers
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");

        const formData = new FormData(event.currentTarget);

        const newUserData: Partial<UserData> = {};

        formData.forEach((data, key) => {
            if(data)
                newUserData[key as keyof UserData] = data.toString();  
        });

        if (!(Object.keys(newUserData).includes("email") && Object.keys(newUserData).includes("password"))){
            setErrorMessage("Tous les champs ne sont pas remplis.");
            return;
        }

        setIsRequesting(true);

        userServiceInstance
            .register(newUserData)
            .then(() => {
                setIsRequesting(false);
                setIsRequestSuccess(true);
            })
            .catch(() => setErrorMessage("Ooops ! Une erreur sauvage vient d'apparaitre."));
    };

    return (
        <Container
            sx={{
                backgroundImage: `url(${sandglassImageUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPositionX: "right",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h3">
                Le son qui transcende les frontières.
            </Typography>
            { !isRequestSuccess ?
                <RegisterForm handling={{isRequesting, errorMessage, handleSubmit}} /> :
                <Box sx={{margin :"10em"}}>
                    <Typography variant="h4">
                    Bienvenue ! Un email de validation t'a été envoyé.
                    </Typography>
                    <Link to="/login">Connecte-toi</Link>
                </Box>
            }
            <Box sx={{width: "8em"}}>
                {isRequesting ? <LinearProgress color="secondary" /> : null}
            </Box>
            <p>{errorMessage}</p>
        </Container>
    );
};

type RegisterFormProps = {
  handling: {
    isRequesting: boolean;
    errorMessage: string;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }
};

/**
 * RegisterForm
 * @param {RegisterFormProps} props : Component props.
 * @returns {JSX.Element} : The component.
 */
function RegisterForm({handling}:RegisterFormProps) {
    const {isRequesting, handleSubmit} = handling;
    
    return (
        <>
            <Typography variant="h3" component="h2">
        Inscris-toi !
            </Typography>
            <Container maxWidth="xs">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    display={"flex"}
                    flexDirection={"column"}
                    sx={{ my: 4, width: "100%" }}
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
                    <TextField
                        margin="normal"
                        fullWidth
                        name="firstname"
                        label="Ton prénom"
                        type="text"
                        id="firstname"
                        autoComplete="first-name"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="lastname"
                        label="Ton nom"
                        type="text"
                        id="lastname"
                        autoComplete="family-name"
                    />
                    <RoundedButton
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        disabled={isRequesting}
                    >
                        {!isRequesting ? "S'inscrire" : <CircularProgress size={"2rem"}/>}
                    </RoundedButton>
                </Box>
                <Box sx={{marginBottom: "1em"}}>
                    <Link to="/login">T'as déjà un compte ? Connecte-toi</Link>
                </Box>
            </Container>
        </>
    );
}
