import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userServiceInstance from "../services/user.service";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        userServiceInstance.checkAuthentication()
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(()=> {
                navigate("/login");
            });
    }, []);

    return isAuthenticated;
};

export { useAuth };
