import "./card-track.css";

import { Alert, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/system";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import { IPlaylist } from "../../../services/playlists.service.type";
import IconButton from "@mui/material/IconButton";
import ImgEternity from "../../../assets/song/img-eternity.png";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { PlaylistsService } from "../../../services/playlists.service";
import React from "react";
import { Track } from "../../../services/tracks.service.type";

const theme = createTheme({
    palette: {
        background: {
            white: "#ffffff",
        },
        text: {
            black: "#173A5E",
            mallow: "#B9B9B9",
            white: "#ffffff",
        },
        action: {
            active: "#001E3C",
        },
        success: {
            dark: "#009688",
        },
    },
});

interface CardTrackProps {
    track: Track;
    availablePlaylists: IPlaylist[];
    setAvailablePlaylists: Dispatch<SetStateAction<IPlaylist[]>>;
    isPlaying: boolean;
    setPlayingTrackIndex: (playing: boolean) => void
    startOver: boolean;
}

const CardTrack = ({ 
    track,
    isPlaying,
    setPlayingTrackIndex,
    startOver,
    availablePlaylists,
    setAvailablePlaylists }: CardTrackProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrackAlreadyInPlaylist, setIsTrackAlreadyInPlaylist] = useState(false);
    const [isAddedToPlaylist, setIsAddedToPlaylist] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            if (startOver && audio) {
                audio.currentTime = 0;
            }
            audio?.play();
        } else if (!isPlaying) {
            audio?.pause();
        }
    }, [isPlaying]);
    
    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsAddedToPlaylist(false);
        setIsTrackAlreadyInPlaylist(false);
    };

    const playPauseTrack = () => {
        if (isPlaying) {
            setPlayingTrackIndex(false);
        } else {
            setPlayingTrackIndex(true);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddToPlaylist = (playlistId: string, trackId:string) => {
        const isTrackAlreadyInPlaylist = availablePlaylists.find((playlist) => {
            return playlist.tracks.find((track) => track._id === trackId);
        });
        if(isTrackAlreadyInPlaylist) {
            setIsTrackAlreadyInPlaylist(true);
            return;
        }
        PlaylistsService.addTrackToPlaylist(playlistId, trackId).then((playlist: IPlaylist) => {
            setAvailablePlaylists((prevPlaylists: IPlaylist[]) => {
                return prevPlaylists.map((prevPlaylist: IPlaylist) => {
                    if (prevPlaylist._id === playlist._id) {
                        return playlist;
                    }
                    return prevPlaylist;
                });
            });
            setIsAddedToPlaylist(true);
            handleCloseModal();
        });
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="card-open-modal-playlist">
                    <div className="card-track">
                        <div className="wrapper-card-track">
                            <div className="banner-image">
                                <img src={ImgEternity} alt="banner" />
                            </div>
                            <h1 className="title-track-card">{track.title}</h1>
                            <p>{track.duration}</p>
                    
                        </div>
                        <div className="btn-wrapper">
                            <Box 
                                sx={{ 
                                    display: "flex",
                                    alignItems: "center",
                                    pl: 1, pb: 1,
                                }}>
                                <IconButton
                                    aria-label="play/pause"
                                    onClick={playPauseTrack}
                                    style={{ color: "white", fontSize: "2rem", marginLeft: "12px" }}
                                >
                                    {isPlaying ? (
                                        <PauseIcon sx={{ height: 38, width: 38 }} />
                                    ) : (
                                        <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                                    )}
                                </IconButton>
                            </Box>
                            <h6 className="title-add-to-playlist" onClick={handleOpenModal}>
                                Ajouter à la playlist
                            </h6>
                            <audio
                                autoPlay={false}
                                preload="none"
                                ref={audioRef}
                                src={`http://localhost:3000/api/tracks/${track._id}/play`} />
                        </div>
                    </div>
                    {isModalOpen && (
                        <div className="modal-playlist" onClick={handleCloseModal}>
                            <ul className="lists-playlists-modal" >
                                {availablePlaylists.map((playlist) => (
                                    <li className="playlist-modal" key={playlist._id} style={{ display: "flex" }}>
                                        <h6 className="title-playlist">{playlist.name}</h6>
                                        <AddCircleIcon
                                            className="btn-add-to-playlist"
                                            style={{ margin: "1.5rem 2rem 0 1rem", fontSize: "1rem" }}
                                            onClick={() => {
                                                handleAddToPlaylist(playlist._id, track._id);
                                                handleCloseModal();
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </ThemeProvider>
            <Snackbar 
                open={isTrackAlreadyInPlaylist} 
                autoHideDuration={3000} 
                onClose={handleClose} 
            >
                <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
                    Cette musique est déjà dans la playlist
                </Alert>
            </Snackbar>
            <Snackbar
                open={isAddedToPlaylist}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Cette musique a été ajouté à la playlist avec succès
                </Alert>
            </Snackbar>
        </>                                     
    );
};
export default CardTrack;
