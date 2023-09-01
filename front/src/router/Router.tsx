import {HomeAccount, LoggedInLayout} from "../pages/user";
import {Album, Login, PageNotFound, Profile, Register, SearchResults, Validation} from "../pages";
import {Navigate, Route, Routes} from "react-router-dom";
import Playlist from "../pages/playlist/playlist";
import AlbumDetail from "../pages/album-detail/album-detail";

// import Playlist from "../pages/playlist/playlist";

const Router = () => {
    const searchResults = {albums: [], tracks: []};

    return (
        <Routes>
            <Route path="/" element={<Navigate to="login"/>}/>
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="validate" element={<Validation/>}>
                {/* All the homepage sub routes */}
            </Route>
            <Route path="home" element={<LoggedInLayout/>}>
                {/* TODO RENAME HOME ACCOUNT */}
                <Route path="" element={<HomeAccount/>}/>
                <Route path="searchResults" element={<SearchResults searchResults={searchResults}/>}/>
                <Route path="playlists" element={<Playlist/>}/>
                <Route path="profile" element={<Profile/>}/>
                <Route path="album" element={<AlbumDetail/>}/>
                <Route path="albums" element={<Album/>}/>
            </Route>

            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    );
};

export {Router};
