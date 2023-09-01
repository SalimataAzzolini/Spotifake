import { Button } from "@mui/material";
import { To, useNavigate } from "react-router-dom";

interface RedirectButtonProps {
    to: To,
    label: string | JSX.Element
}

export const RedirectButton = ({ to, label }: RedirectButtonProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return (
        <Button variant="contained" onClick={handleClick}>
            {label}
        </Button>
    );
};
