import "./search-results.css";

import {useEffect, useRef, useState} from "react";

import {AlbumType} from "../../services/albums.service.type";
import CardAlbum from "../../components/user/card-album/card-album";
import CardTrack from "../../components/user/card-track/card-track";
import {Inbox} from "@mui/icons-material";
import InputSearch from "../../components/user/input-search/input-search";
import MusicLine from "../../assets/img/music-line.png";
import {SearchResult} from "../../services/search.type";
import {Track} from "../../services/tracks.service.type";
import TrackPlayer from "../../components/user/track-player/track-player";
import TuneIcon from "@mui/icons-material/Tune";
import {useLocation} from "react-router-dom";

interface SearchResultsProps {
    searchResults: SearchResult;
}

const SearchResults: React.FC<SearchResultsProps> = () => {
    const searchResults = useLocation().state?.searchResults;
    const availablePlaylists = useLocation().state?.playlists;
    const [playlists, setPlaylists] = useState(availablePlaylists || []);

    const [filteredByStyle, setFilteredByStyle] = useState<AlbumType[]>([]);
    const [filteredByArtist, setFilteredByArtist] = useState<AlbumType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFilterByStyle = (style: string) => {
        setFilteredByStyle(searchResults.albums.filter((album: AlbumType) => album.styles.includes(style)));
        handleCloseModal();
    };

    const handleFilteredByArtist = (artist: string) => {
        setFilteredByArtist(searchResults.albums.filter((album: AlbumType) => album.artist === artist));
        handleCloseModal();
    };

    const uniqueArtists = searchResults.albums.reduce((artists: string[], album: AlbumType) => {
        if (!artists.includes(album.artist)) {
            artists.push(album.artist);
        }
        return artists;
    }, []);

    const uniqueStyles = searchResults.albums.reduce((styles: string[], album: AlbumType) => {
        album.styles.forEach((style) => {
            if (!styles.includes(style)) {
                styles.push(style);
            }
        });
        return styles;
    }
    , []);

    const [playingTrackIndex, setPlayingTrackIndex] = useState<number>(-1);
    const [currentTrack, setCurrentTrack] = useState<Track>();
    const [startOver, setStartOver] = useState(false);

    useEffect(() => {
        if (playingTrackIndex >= 0) {
            setCurrentTrack(searchResults.tracks[playingTrackIndex]);
        }
    }, [playingTrackIndex]);

    const audioRef = useRef();
    const progressBarRef = useRef();

    const handlePlayPause = () => {
        setStartOver(false);
        if (playingTrackIndex >= 0) {
            setPlayingTrackIndex(-1);
        } else {
            setPlayingTrackIndex(searchResults.tracks.findIndex((track: Track) => track._id === currentTrack?._id));
        }
    };

    const handlePrevious = () => {
        setPlayingTrackIndex((prevIndex) => {
            if (prevIndex === 0) {
                return searchResults.tracks.length - 1; // Go to the last track
            } else {
                return (prevIndex - 1) % searchResults.tracks.length;
            }
        });
        setStartOver(true);
    };

    const handleNext = () => {
        setPlayingTrackIndex((prevIndex) => (prevIndex + 1) % searchResults.tracks.length);
        setStartOver(true);
    };

    return (
        <div className="container-page-search-result">
            <div className="music-title-img">
                <img src={MusicLine} alt="music-line" className="music-line"/>
                <h1 className="music-title">TA RECHERCHE</h1>
                <img src={MusicLine} alt="music-line" className="music-line"/>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "2em"
            }}>
                <InputSearch/>
            </div>

            <h3 className="title-sort">FILTRER ET TRIER
                <TuneIcon style={{marginBottom: "-5px", marginLeft: "15px"}}
                    onClick={handleOpenModal}
                />
            </h3>
            {isModalOpen && (
                <div className="modal-filter" onClick={handleCloseModal}>
                    <ul className="container-filter-artist">
                        ARTISTES
                        {uniqueArtists.map((artist: string, index: number) => (
                            <li key={index} onClick={() => handleFilteredByArtist(artist)}>
                                {artist}
                            </li>
                        ))}
                    </ul>
                    <ul className="container-filter-styles">
                        STYLES
                        {uniqueStyles.map((style: string, index: number) => (
                            <li key={index} onClick={() => handleFilterByStyle(style)}>
                                {style}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {searchResults.albums.length === 0 && searchResults.tracks.length === 0 &&
                <h3 style={{
                    margin: "0",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Inbox style={{width: "100%", height: "4em"}}/>
                    Aucun résultat
                </h3>
            }

            <div className="container-card-album-search">
                {filteredByStyle.length === 0 ? filteredByArtist.length === 0 ?

                    searchResults.albums.map((album: AlbumType, index: number) => (
                        <CardAlbum key={index} album={album}/>
                    ))

                    : filteredByArtist.map((album: AlbumType, index: number) => (
                        <CardAlbum key={index} album={album}/>
                    ))

                    : filteredByStyle.map((album: AlbumType, index: number) => (
                        <CardAlbum key={index} album={album}/>
                    ))}
            </div>

            {searchResults.tracks.length !== 0 &&
                <h3 style={{margin: "0"}}>Musiques</h3>}
            {searchResults.tracks.map((track: Track, index: number) => (
                <CardTrack
                    availablePlaylists={playlists}
                    setAvailablePlaylists={setPlaylists}
                    key={index}
                    track={track}
                    isPlaying={playingTrackIndex === index}
                    setPlayingTrackIndex={(playing) => {
                        return playing ? setPlayingTrackIndex(index) : setPlayingTrackIndex(-1);
                    }}
                    startOver={startOver}
                />
            ))}

            <TrackPlayer
                isPlaying={playingTrackIndex >= 0}
                currentTrack={currentTrack}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                audioRef={audioRef}
                progressBarRef={progressBarRef}
            />
        </div>
    );
};
export {SearchResults};
