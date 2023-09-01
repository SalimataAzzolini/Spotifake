import "./card-album.css";
import {Button} from "@mui/material";
import ImgCard from "../../../assets/music-thumb-placeholder.png";
import {useNavigate} from "react-router-dom";
import {AlbumType} from "../../../services/albums.service.type";

interface CardAlbumProps {
    album: AlbumType;
}

const CardTrack = ({album}: CardAlbumProps) => {

    const navigate = useNavigate();

    const handleVisitAlbum = () => {
        navigate("/home/album", {state: {album}});
    };
    return (
        <div className="card-album" style={{
            backgroundImage: `url(${ImgCard})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            <div className="card-informations">
                <h1 className="title-album-card">{album.title}</h1>
                <p>{album.artist}</p>

                <Button className="btn-show-album" onClick={handleVisitAlbum}>
                    Voir l'album
                </Button>
            </div>
        </div>
    );
};

export default CardTrack;
