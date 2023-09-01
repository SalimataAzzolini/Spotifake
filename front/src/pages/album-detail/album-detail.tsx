import React, {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom";
import type {AlbumType, Track} from "../../services/albums.service.type";
import AlbumCover from "../../assets/album-cover.jpg";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PauseIcon from "@mui/icons-material/Pause";

import "./album-detail.css";
import TrackPlayer from "../../components/user/track-player/track-player";

interface PlayerState {
    currentTrack: Track | undefined;
    currentIndex: number;
    isPlaying: boolean;
    startOver: boolean;
}

export const AlbumDetail: React.FC = () => {
    const album: AlbumType | null = useLocation().state?.album;
    const tracks = album?.tracks || [];
    const [player, setPlayer] = useState<PlayerState>({
        currentTrack: undefined,
        currentIndex: -1,
        isPlaying: false,
        startOver: false
    });

    const isCurrentTrackAndPlaying = (track: Track) => {
        return player.currentTrack?._id === track._id && player.isPlaying;
    };
    const progressBarRef = useRef();

    const stopCurrentAudio = () => {
        // Stop previously playing audio
        if (player.isPlaying) {
            const target = audioRefs.current[player.currentTrack?._id || ""];
            if (target) {
                target.currentTime = 0;
                target.pause();
            }
        }
    };

    const playPauseTrack = (track: Track, index: number) => {
        // Stop previously playing audio
        if (player.isPlaying && index !== player.currentIndex) {
            const target = audioRefs.current[index];
            if (target) {
                target.currentTime = 0;
                target.pause();
            }
        }

        // If its the same track toggle the isPlaying state
        if (track._id === player.currentTrack?._id) {
            setPlayer({
                ...player,
                currentTrack: track,
                currentIndex: index,
                isPlaying: !player.isPlaying
            });
        } else {
            setPlayer({
                ...player,
                currentTrack: track,
                currentIndex: index,
                isPlaying: true
            });
        }
    };

    // Dictionnary of audio refs by trackId
    const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
    const audioRef = useRef();

    // Whenever isPlaying or currentTrack state has changed, trigger audio events on elements
    useEffect(() => {
        const audio = audioRefs.current;
        const target = audio[player.currentTrack?._id || -1];
        if (target && player.isPlaying) {
            if (player.startOver) {
                target.currentTime = 0;
            }
            target?.play();
        } else {
            target?.pause();
        }
    }, [player.isPlaying, player.currentTrack]);

    const handlePlayerPlayPause = () => {
        if (player.currentTrack) {
            // Play or pause the current track
            playPauseTrack(player.currentTrack, player.currentIndex);
        } else {
            // If no tracks has been previously selected, play the first track of the album
            playPauseTrack(tracks[0], 0);
        }
    };

    const handlePrevious = () => {
        const targetIndex = !player.currentIndex ? tracks.length - 1 : (player.currentIndex - 1) % tracks.length;
        stopCurrentAudio();
        setPlayer({
            ...player,
            currentIndex: targetIndex,
            currentTrack: tracks[targetIndex],
            startOver: true
        });
    };

    const handleNext = () => {
        const targetIndex = (player.currentIndex + 1) % tracks.length;
        stopCurrentAudio();
        setPlayer({
            ...player,
            currentIndex: targetIndex,
            currentTrack: tracks[targetIndex],
            startOver: true
        });

    };

    return (
        <>
            <Container maxWidth="md" className="album-detail-container">
                <Card raised sx={{borderRadius: "1em"}}>
                    <CardMedia
                        component="img"
                        alt="cover album"
                        height="300"
                        image={AlbumCover}
                    />
                    <CardContent>
                        <div className="album-detail-card-header">
                            <Typography variant="h5" component="span" sx={{mr: 1}}>
                                {album?.title} ({album?.year})
                            </Typography>

                            {album?.styles.map((style, index) => (
                                <Chip key={index} label={style} color="primary"/>
                            ))}
                        </div>
                        <Typography variant="subtitle1" color="textSecondary">
                            {album?.artist}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems={"center"} marginTop={2}>
                            <Avatar sx={{color: "white"}}>
                                <ModeCommentIcon/>
                            </Avatar>
                            <Typography variant="body1" component="p">
                                Description: {album?.description}
                            </Typography>
                        </Stack>
                        <Divider sx={{mt: 2, mb: 2}}>
                            <Chip
                                variant="outlined"
                                label="Musiques"
                                icon={<MusicNoteIcon/>}
                            />
                        </Divider>
                        <List sx={{width: "100%", bgcolor: "background.paper", borderRadius: "1em"}}>
                            {(album?.tracks || []).map((track, index, {length}) => (
                                <React.Fragment key={index}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <IconButton
                                                    aria-label="play/pause"
                                                    onClick={() => playPauseTrack(track, index)}
                                                >
                                                    {isCurrentTrackAndPlaying(track) ? (
                                                        <PauseIcon sx={{height: 38, width: 38}}/>
                                                    ) : (
                                                        <PlayArrowIcon sx={{height: 38, width: 38}}/>
                                                    )}
                                                </IconButton>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={track.title} secondary={track.duration}/>
                                        <audio
                                            autoPlay={false}
                                            preload="none"
                                            ref={(element) => audioRefs.current[track._id] = element}
                                            src={`http://localhost:3000/api/tracks/${track._id}/play`}/>
                                    </ListItem>
                                    {index < (length - 1) && <Divider variant="inset" component="li"/>}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

            </Container>
            <TrackPlayer
                isPlaying={player.isPlaying}
                currentTrack={player.currentTrack}
                onPlayPause={handlePlayerPlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                audioRef={audioRef}
                progressBarRef={progressBarRef}
            />
        </>
    );
};

export default AlbumDetail;
