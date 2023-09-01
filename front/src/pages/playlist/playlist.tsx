import "./playlist.css";

import { Alert, Box, Button, Container, Input } from "@mui/material";
import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { IPlaylist } from "../../services/playlists.service.type";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import MusicLine from "../../assets/img/music-line.png";
import { PlaylistsService } from "../../services/playlists.service";
import TrackCover from "../../assets/music-thumb-placeholder.png";
import { useNavigate } from "react-router-dom";

function Playlist(): JSX.Element {
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [isEditingPlaylist, setIsEditingPlaylist] = useState(false);
    const [editingPlaylistId, setEditingPlaylistId] = useState("");
    const [createButtonClicked, setCreateButtonClicked] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchPlaylists();
    }, []);

    const createPlaylist = () => {
        if(newPlaylistName === "" || newPlaylistName === undefined) {
            setCreateButtonClicked(true);
            return;
        } else {

            PlaylistsService.createPlaylist(newPlaylistName).then((response) => {
                setPlaylists([...playlists, response]);
                setIsCreatingPlaylist(false);
            }).catch((e) => {
                console.error(e);
            });
        }
    };

    const fetchPlaylists = async () => {
        PlaylistsService.getAllPlaylists().then((response) => {
            setPlaylists(response);
        }).catch((e) => {
            console.error(e);
        });
    };

    const deletePlaylist = async (playlistId : string) => {
        PlaylistsService.deletePlaylist(playlistId).then(() => {
            const updatedPlaylists = playlists.filter(
                (playlist) => playlist._id !== playlistId
            );
            setPlaylists(updatedPlaylists);
        }).catch((e) => {
            console.error(e);
        });
    };

    const updatePlaylist = async (playlistId : string, newName : string) => {
        if(newName === "" || newName === undefined) {
            setCreateButtonClicked(true);
            return;
        }
        else {
            PlaylistsService.updatePlaylist(playlistId, newName).then(() => {
                const updatedPlaylists = playlists.map((playlist) => {
                    if (playlist._id === playlistId) {
                        return { ...playlist, name: newName };
                    }
                    return playlist;
                });
                setPlaylists(updatedPlaylists);
                setEditingPlaylistId("");
                setIsEditingPlaylist(false);
            }
            ).catch((e) => {
                console.log(e);
            });
        
        } 
    };

    const deleteTrackFromPlaylist = async (trackId : string, playlistId : string) => {
        PlaylistsService.deleteTrackFromPlaylist(trackId, playlistId).then(() => {
            setPlaylists(playlists.map((playlist) => {
                if (playlist._id === playlistId) {
                    return { ...playlist, tracks: playlist.tracks.filter((track) => track._id !== trackId) };
                }
                return playlist;
            }
            ));
        }).catch((e) => {
            console.log(e);
        });

    };
    const handleNavigateHome = () => {
        navigate("/home");
    };

    return (
        <Box className="container-playlist">
            <Box className="music-title-img">
                <img src={MusicLine} alt="music-line" className="music-line" />
                <h1 className="music-title">TES PLAYLISTS</h1>
                <img src={MusicLine} alt="music-line" className="music-line" />
            </Box>
            {playlists.length === 0 && (
                <h3 id="alert-empty-playlist">
                        Oops, tu n'as pas encore de playlist !
                </h3>
            )}
            <Box className="create-playlist-container">
                {isCreatingPlaylist ? (
                    <Box>
                        <Input
                            type="text"
                            placeholder="Nom de la playlist"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)} />
                        <Button type="submit" variant="contained" onClick={createPlaylist}>
                                Créer
                        </Button>
                        {createButtonClicked && newPlaylistName==""  && (
                            <Alert sx={{width: "70%", fontSize: "0.7em"}} variant="outlined" severity="error">
                                Veuillez entrer un nom
                            </Alert>
                        )}
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        className="btn-create-playlist"
                        onClick={() => {
                            setIsCreatingPlaylist(true);
                            setIsEditingPlaylist(false);
                            setNewPlaylistName("");
                        }
                        }
                    >
                        Créer une playlist
                    </Button>
                )}
            </Box>
            <Box className="container-playlist-list">
                {playlists.map((playlist) => (
                    <Box className="each-playlist-container" key={playlist._id}>
                        {isEditingPlaylist && editingPlaylistId === playlist._id? (
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if(newPlaylistName) {
                                        updatePlaylist(
                                            playlist._id,
                                            newPlaylistName
                                        );
                                        setIsEditingPlaylist(false);
                                    }
                                    setCreateButtonClicked(true);
                                }}
                                className="manage-playlist-container">
                                <Input
                                    type="text"
                                    name="playlistName"
                                    defaultValue={playlist.name}
                                    onChange={(e) => setNewPlaylistName(e.target.value)} />
                                {createButtonClicked && newPlaylistName==""  && (
                                    <Alert sx={{width: "70%", fontSize: "0.7em"}} variant="outlined" severity="error">
                                        Veuillez entrer un nom
                                    </Alert>
                                )}
                                <Button type="submit" variant="contained" color="primary">
                                    Enregistrer
                                </Button>
                               
                            </Box>
                        ) : ( 
                            <Box className="manage-playlist-container">
                                <h3 className="playlist-name">{playlist.name}</h3>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        setIsCreatingPlaylist(false);
                                        setIsEditingPlaylist(true);
                                        setNewPlaylistName(playlist.name);
                                        setEditingPlaylistId(playlist._id);
                                    }}
                                >
                                    Modifier le nom
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => deletePlaylist(playlist._id)}
                                >
                                    <DeleteIcon color="error" />
                                </Button>
                            </Box>
                        )}
                            
                        <Box className="playlist">
                            {playlist.tracks.length === 0 && (
                                <>
                                    <h3 className="empty-playlist-text">Oops, cette playlist est vide !</h3>
                                    <Button variant="outlined" color="primary" onClick={handleNavigateHome}>
                                        Ajouter des musiques
                                    </Button>
                                </>
                            )}
                            <Container fixed className="playlist-tracks">
                                {playlist.tracks.map((track) => (
                                    <Box className="playlist-track" key={track._id}>
                                        <ImageList>
                                            <ImageListItem sx={{marginRight: "5px", minWidth: "200px"}} cols={2}>
                                                <img
                                                    style={{
                                                        borderTopRightRadius: "10px", 
                                                        borderTopLeftRadius: "10px",  
                                                        width: "",
                                                    }}
                                                    src={`${TrackCover}?w=248&fit=crop&auto=format`}
                                                    alt="track-cover"
                                                    title={track.title} 
                                                /> 
                                                <ImageListItemBar
                                                    title={track.title}
                                                    subtitle={track.duration}
                                                    actionIcon={
                                                        <Button
                                                            onClick={() => 
                                                                deleteTrackFromPlaylist(track._id, playlist._id)}
                                                        >
                                                            <DeleteIcon/>
                                                        </Button>
                                                    }
                                                />                                          
                                            </ImageListItem>
                                        </ImageList>
                                    </Box>
                                ))}
                            </Container>

                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Playlist;
