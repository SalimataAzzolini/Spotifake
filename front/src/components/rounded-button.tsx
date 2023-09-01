import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material";

interface RoundedButtonProps extends ButtonProps {
    dark?: "true"
}

export const RoundedButton = styled(Button)<RoundedButtonProps>(({ theme, dark }) => ({
    borderRadius: "15px",
    background: dark ?
        "#1C1037"
        : "linear-gradient(138deg, rgba(158,0,255,1) 0%, rgba(109,217,232,1) 100%)",
    color:  theme.palette.text.primary
}));
