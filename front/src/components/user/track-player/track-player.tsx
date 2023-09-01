import "./track-player.css";

import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Track } from "../../../services/tracks.service.type";
import { useTheme } from "@mui/material/styles";

interface TrackPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  audioRef: any;
  progressBarRef: any;
  currentTrack: Track | undefined;
}

const TrackPlayer = ({
    isPlaying,
    onPlayPause,
    onPrevious,
    onNext,
    audioRef,
    progressBarRef,
    currentTrack,
}: TrackPlayerProps) => {
    const theme = useTheme();
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timer>();
    const handleOnNext = () => {
        setProgress(0);
        onNext();
    };
    const handleOnPrevious = () => {
        setProgress(0);
        onPrevious();
    };

    useEffect(() => {
        if(progress === 0){
            clearInterval(intervalRef.current);
        }
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(prevProgress => prevProgress + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [audioRef, progressBarRef, isPlaying]);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setProgress(value);
    };

    return (
        <div className="container-layout-progress">
            <div className="container-title-icons">
                <h2 className="current-track-title">
                    {currentTrack ? currentTrack.title : "--"}
                </h2>
                <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                    <IconButton
                        aria-label="previous"
                        onClick={handleOnPrevious}
                        style={{ color: "white" }}
                    >
                        {theme.direction === "rtl" ? (
                            <SkipNextIcon />
                        ) : (
                            <SkipPreviousIcon />
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="play/pause"
                        onClick={onPlayPause}
                        style={{ color: "white" }}
                    >
                        {isPlaying ? (
                            <PauseIcon />
                        ) : (
                            <PlayArrowIcon />
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="next"
                        onClick={handleOnNext}
                        style={{ color: "white" }}
                    >
                        {theme.direction === "rtl" ? (
                            <SkipPreviousIcon />
                        ) : (
                            <SkipNextIcon />
                        )}
                    </IconButton>
                </Box>
                <h2 className="current-track-duration">
                    {currentTrack ? currentTrack.duration : "--"}
                </h2>
            </div>

            <div className="progress-bar">
                <input type="range" value={progress} onChange={handleProgressChange} className="input-range-player" />
            </div>
        </div>
    );
};

export default TrackPlayer;
