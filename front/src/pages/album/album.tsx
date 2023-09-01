import {useEffect, useState} from "react";

import {AlbumType} from "../../services/albums.service.type";
import CardAlbum from "../../components/user/card-album/card-album";

// Import MUI
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {styled} from "@mui/system";

// Import interne
import albumsService from "../../services/albums.service";
import disque from "../../assets/disque.png";
import InputSearch from "../../components/user/input-search/input-search";

const AlbumContainer = styled(Container)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin: "3rem auto"
});

const TitleBox = styled(Box)({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
});

const AlbumTitle = styled(Typography)({
    zIndex: 1,
    fontFamily: "\"TT Norms\"",
});

const TitleImage = styled("img")({
    position: "relative",
    height: "100%",
    width: "30%",
    zIndex: 0,
    right: 2,
});

const AlbumList = styled(List)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    listStyle: "none",
    margin: 0,
    overflow: "hidden",

});

const AlbumItem = styled(ListItem)({
    flexBasis: "25%",
    textAlign: "center",
    textDecoration: "none",
    padding: "20px",
});

export function Album() {
    const [albums, setAlbums] = useState<AlbumType[]>();
    const [search] = useState("");

    useEffect(() => {
        const getAlbum = async () => {
            try {
                const fetchedAlbums = await albumsService.getAllAlbums();
                setAlbums(fetchedAlbums);
            } catch (e) {
                console.error(e);
            }
        };
        getAlbum();
    }, []);

    const filteredAlbums = (albums ?? []).filter(album =>
        album.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AlbumContainer id="album">
            <TitleBox className="titleContainer">
                <AlbumTitle variant="h2" className="titreAlbum">
                    ALBUMS
                </AlbumTitle>
                <TitleImage src={disque} alt="disque-disco"/>
            </TitleBox>
            <InputSearch></InputSearch>
            <AlbumList className={"albumList"}>
                {filteredAlbums.map((album: AlbumType, index: number) => (
                    <AlbumItem key={index}>
                        <CardAlbum album={album}/>
                    </AlbumItem>
                ))}
            </AlbumList>
        </AlbumContainer>
    );
}
