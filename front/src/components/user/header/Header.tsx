import "./header.css";

import {useEffect, useState} from "react";

import Logo from "../../../assets/img/logo2.png";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const [toggleMenu, setToggleMenu] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("auth");
        navigate("/login");
    };

    const toggleNav = () => {
        setToggleMenu(!toggleMenu);
        setMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setToggleMenu(false);
        setMenuOpen(false);
    };

    useEffect(() => {
        const changeWidth = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener("resize", changeWidth);
        return () => {
            window.removeEventListener("resize", changeWidth);
        };
    }, []);

    return (
        <nav>
            {(toggleMenu || screenWidth > 850) && (
                <>
                    <ul className="list">
                        <img src={Logo} alt="logo" className="logo-account-desktop" onClick={() => navigate("/home")}
                        />
                        <li className="items" onClick={() => {
                            navigate("/home");
                            closeMenu();
                        }}>Accueil
                        </li>
                        <li
                            className="items"
                            onClick={() => {
                                navigate("/home/playlists");
                                closeMenu();
                            }}
                        >
                            Playlists
                        </li>
                        <li className="items" onClick={() => {
                            navigate("/home/albums");
                            closeMenu();
                        }}>Albums
                        </li>
                        <li
                            className="items li-to-hide"
                            onClick={() => {
                                navigate("/home/profile");
                                closeMenu();
                            }}
                        >
                            Profile
                        </li>
                        <li
                            className="items li-to-hide"
                            onClick={() => {
                                handleLogout();
                                closeMenu();
                            }}
                        >
                            Déconnexion
                        </li>
                    </ul>

                    <div className="container-btn-nav">
                        <button className="btn-nav btn-profil"
                            onClick={() => navigate("/home/profile")}> Profile
                        </button>
                        <button className="btn-nav btn-logout"
                            onClick={handleLogout}
                        > Déconnexion
                        </button>
                    </div>
                </>
            )}

            <MenuIcon onClick={toggleNav} className={`btn-menu ${isMenuOpen ? "open" : ""}`}/>
        </nav>
    );

};

export default Header;
