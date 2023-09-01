import { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    TextFieldProps,
    Modal,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { RoundedButton } from "../../components/rounded-button";
import { type UserData } from "../../services/user.service.type";
import { useAuth } from "../../hooks";
import userServiceInstance from "../../services/user.service";

import platine from "../../assets/platine-revert.png";

const Profile = () => {
    
    const isAuthenticated = useAuth();

    return(
        <Container
            maxWidth="md"
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 8
            }}>
            {!isAuthenticated ?
                <Box>
                    <CircularProgress size={"2rem"} color="secondary" role="img"/>
                </Box> :
                <MainProfileContent />
            }
        </Container>
    );
};

/**
 * Profile page main content.
 * 
 * @returns : The component.
 */
function MainProfileContent() {
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isdeletedModalOpen, setIsdeletedModalOpen] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const deleteAcccountHandler = () => {
        const token = sessionStorage.getItem("auth");

        userServiceInstance.deleteAccount(token)
            .then(() => {
                sessionStorage.removeItem("auth");
                setIsdeletedModalOpen(true);
            })
            .catch(() => setError("Une erreur est survenue"))
            .finally(() => setIsConfirmationModalOpen(false));
    };

    return(
        <>
            <Box flex={1} mt="2rem">
                <Typography variant="h3" component="h2">
                    TES INFOS
                </Typography>
            </Box>
            <Box
                flex={9}
                display={"flex"}
                sx={{
                    backgroundImage: `url(${platine})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPositionX: "left",
                    backgroundColor: "white",
                    width: "100%",
                    color: "black"
                }}>
                <Box flex={5} />
                <ProfileUpdateForm error={error}/>
            </Box>
            <Box flex={2}>
                <RoundedButton
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={()=> setIsConfirmationModalOpen(true)}
                >
                    Supprimer le compte
                </RoundedButton>
                <Box display={"flex"} justifyContent={"center"}>
                    <Link to="/home">
                        Retour à l'accueil
                    </Link>
                </Box>
            </Box>
            <Modal
                open={isConfirmationModalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    pl: 4,
                    pt: 4
                }}>
                    <Typography id="modal-modal-title" variant="h5" component="h3">
                        Ne nous quittes pas,
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Nous t'offrirons des perles de pluies venues de pays où il ne pleut pas !
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="flex-end" 
                        justifyContent="flex-end" 
                        width="100%"
                    >
                        <RoundedButton
                            variant="contained"
                            sx={{ mt: 2, mb: 1, fontSize: "0.6rem", mx: "0.25rem" }}
                            onClick={()=> setIsConfirmationModalOpen(false)}
                        >
                            Ok ! J'ai la ref.
                        </RoundedButton>
                        <RoundedButton
                            variant="contained"
                            sx={{ mt: 2, mb: 1, fontSize: "0.6rem", mx: "0.25rem"  }}
                            onClick={deleteAcccountHandler}
                        >
                            Si ! Spotify c'est mieux.
                        </RoundedButton>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={isdeletedModalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    pl: 4,
                    pt: 4
                }}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        La compte a bien été supprimé.
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="flex-end" 
                        justifyContent="flex-end" 
                        width="100%"
                    >
                        <RoundedButton
                            variant="contained"
                            sx={{ mt: 2, mb: 1, fontSize: "0.6rem", mx: "0.25rem" }}
                            onClick={()=> navigate("/login")}
                        >
                            Retour
                        </RoundedButton>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

/**
 * ProfileUpdateForm
 * @returns {JSX.Element} : The component.
 */
type UpdateProps = {
    error?: string
}
function ProfileUpdateForm(props:UpdateProps) {

    const { error = "" } = props;
    const [profileInfo, setProfileInfo] = useState<Partial<UserData>>();
    const [errorMessage, setErrorMessage] = useState({
        message: "",
        color: "orange"
    });
    const [snackBarUpdated, setSnackBarUpdated] = useState(false);

    const token = sessionStorage.getItem("auth");

    useEffect(() => {
        userServiceInstance.getProfileInfo(token)
            .then(res =>setProfileInfo(res))
            .catch(() => {
                setErrorMessage({
                    message: "Nous n'avons pas pu afficher les informations du compte.",
                    color: "red"
                });
            });
    }, []);

    useEffect(() => setErrorMessage({
        message: error,
        color: "red"
    }), [error]);
    
    async function udpateProfileSubmitHandler(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        setErrorMessage({
            message: "",
            color: "orange"
        });

        // Get all changed data
        const formData = new FormData(event.currentTarget);

        const newProfileInfo: Partial<UserData> = {};

        formData.forEach((data, key) => {
            if(data)
                newProfileInfo[key as keyof UserData] = data as string;  
        });

        // Cancel request if no field has been set
        if(Object.keys(newProfileInfo).length === 0)
            return;
        
        // Request
        userServiceInstance.updateProfileInfo(token, newProfileInfo)
            .then(response =>{
                setProfileInfo({
                    ...profileInfo,
                    ...response
                });
                setSnackBarUpdated(true);
            })
            .catch((message) => setErrorMessage(message));
    }

    /**
     * Form elements props
     */
    const labelProps = {
        component:"label",
        color:"grey",
        fontSize: 18,
        fontFamily: "Georgia"
    };

    function textfieldProps(type: string): TextFieldProps {
        return {
            variant:"standard",
            margin:"normal",
            fullWidth: true,
            id: type,
            name: type,
            color: "secondary",
            sx:{
                borderBottom: "3px solid lightgrey",
                input: {
                    color: "black"
                }
            }
        };
    }
    
    return(
        <>
            <Box
                flex={15}
                display="flex"
                flexDirection="column"
                paddingX={5}
                sx={{backgroundColor: "white"}}
                component="form"
                onSubmit={udpateProfileSubmitHandler}
            >
                <Box flex={3} display="flex" alignItems="center" >
                    <Typography color={errorMessage.color}>
                        {errorMessage.message}
                    </Typography>
                </Box>
                <Box flex={13} display="flex" flexDirection="column">
                    <Box
                        flex={1}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Box 
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                        >
                            <Typography {...labelProps}>
                            Nom
                            </Typography>
                            <TextField
                                {...textfieldProps("lastname")}
                                autoComplete="last-name"
                                placeholder={profileInfo?.lastname}
                            />
                        </Box>
                        <Box>
                            <Typography {...labelProps}>
                            Prénom
                            </Typography>
                            <TextField
                                {...textfieldProps("firstname")} 
                                autoComplete="first-name" 
                                placeholder={profileInfo?.firstname}
                            />
                        </Box>
                    </Box>
                    <Box flex={1} sx={{ mt:1 }}>
                        <Typography  {...labelProps}>
                        Email
                        </Typography>
                        <TextField
                            {...textfieldProps("email")}
                            autoComplete="email"
                            placeholder={profileInfo?.email}
                        />
                    </Box>
                    <Box flex={1} sx={{ mt:1 }}>
                        <Typography  {...labelProps}>
                        Mot de passe
                        </Typography>
                        <TextField
                            {...textfieldProps("password")}
                            type="password"
                            autoComplete="current-password"
                            placeholder="mot de passe"
                        />
                    </Box>
                </Box>
                <Box flex={4} display="flex" justifyContent="center" alignItems="center">
                    <RoundedButton
                        type="submit"
                        variant="contained"
                        dark="true"
                        sx={{ mt: 2, mb: 2, fontWeight: "bold"}}
                    >
                    Modifier mes infos
                    </RoundedButton>
                </Box>
            </Box>
            <Snackbar
                open={snackBarUpdated}
                autoHideDuration={5000}
                onClose={() => setSnackBarUpdated(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Le profil a bien été mis à jour.
                </Alert>
            </Snackbar>
        </>
    );
}

export { Profile };
