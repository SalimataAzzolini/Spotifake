import "./input-search.css";

import {ChangeEvent, KeyboardEvent, useState} from "react";

import {IPlaylist} from "../../../services/playlists.service.type";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import {SearchService} from "../../../services/search.service";
import {useNavigate} from "react-router-dom";

interface InputSearchProps {
    playlists?: IPlaylist[];
}

const InputSearch: React.FC<InputSearchProps> = ({playlists}) => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await SearchService.search(searchValue);
            navigate("/home/searchResults", {state: {searchResults: response, playlists}});
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };
    return (

        <Paper
            component="form"
            className="input-search"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 600,
                borderRadius: "50px",
                backgroundColor: "white",
                margin: "1rem 0 1rem 0"
            }}

        >
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder=""
                inputProps={{"aria-label": ""}}
                style={{padding: "12px 20px", color: "black"}}
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <IconButton type="button"
                sx={{p: "15px"}}
                aria-label="search"
                style={{color: "#AE5310"}}
                onClick={handleSearch}
            >
                <SearchIcon/>
            </IconButton>
        </Paper>

    );
};

export default InputSearch;
