import "./home-account.css";

import { Box, CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import CardTrack from "../../../components/user/card-track/card-track";
import { IPlaylist } from "../../../services/playlists.service.type";
import InputSearch from "../../../components/user/input-search/input-search";
import MusicLine from "../../../assets/img/music-line.png";
import { PlaylistsService } from "../../../services/playlists.service";
import { Track } from "../../../services/tracks.service.type";
import TrackPlayer from "../../../components/user/track-player/track-player";
import { TracksService } from "../../../services/tracks.service";
import TuneIcon from "@mui/icons-material/Tune";
import { useAuth } from "../../../hooks";

const HomeAccount = (): JSX.Element => {
    const [tracksData, setTracksData] = useState<Track[]>([]);
    const [playingTrackIndex, setPlayingTrackIndex] = useState<number>(-1);
    const [currentTrack, setCurrentTrack] = useState<Track>();
    const [startOver, setStartOver] = useState(false);
    const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

    useEffect(() => {
        if (playingTrackIndex >= 0) {
            setCurrentTrack(tracksData[playingTrackIndex]);
        }
    }, [playingTrackIndex]);

    const audioRef = useRef();
    const progressBarRef = useRef();
    const isAuthenticated = useAuth();

    useEffect(() => {
        TracksService.getAllTracks().then((tracks) => {
            setTracksData(tracks);
        });
        PlaylistsService.getAllPlaylists().then((playlists) => {
            setPlaylists(playlists);
        });
    }, []);

    const handlePlayPause = () => {
        setStartOver(false);
        if (playingTrackIndex >= 0) {
            setPlayingTrackIndex(-1);
        } else {
            setPlayingTrackIndex(tracksData.findIndex((track => track._id === currentTrack?._id)));
        }
    };

    const handlePrevious = () => {
        setPlayingTrackIndex((prevIndex) => {
            if (prevIndex === 0) {
                return tracksData.length - 1; // Go to the last track
            } else {
                return (prevIndex - 1) % tracksData.length;
            }
        });
    };

    const handleNext = () => {
        setPlayingTrackIndex((prevIndex) => (prevIndex + 1) % tracksData.length);
        setStartOver(true);
    };

    return (
        <div className="container-page-account">
            {!isAuthenticated ?
                <Box>
                    <CircularProgress size={"2rem"} color="secondary" />
                </Box>
                :
                <>
                    <div className="music-title-img">
                        <img src={MusicLine} alt="music-line" className="music-line" />
                        <h1 className="music-title">MUSIQUES</h1>
                        <img src={MusicLine} alt="music-line" className="music-line" />
                    </div>
                    <div className="container-input-search">
                        <InputSearch playlists={playlists} />
                    </div>
                    <h3 className="title-sort">FILTRER ET TRIER
                        <TuneIcon style={{ marginBottom: "-5px", marginLeft: "15px" }}
                        />
                    </h3>

                    <div className="container-cards-track">
                        {tracksData.map((track, index) => (
                            <CardTrack
                                key={index}
                                track={track}
                                startOver={startOver}
                                isPlaying={playingTrackIndex === index}
                                setPlayingTrackIndex={(playing) => {
                                    return playing ? setPlayingTrackIndex(index) : setPlayingTrackIndex(-1);
                                }}
                                setAvailablePlaylists={setPlaylists}
                                availablePlaylists={playlists}
                            />
                        ))}
                    </div>

                    <TrackPlayer
                        isPlaying={playingTrackIndex >= 0}
                        currentTrack={currentTrack}
                        onPlayPause={handlePlayPause}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        audioRef={audioRef}
                        progressBarRef={progressBarRef}
                    />
                </>
            }
        </div>
    );
};

export default HomeAccount;
