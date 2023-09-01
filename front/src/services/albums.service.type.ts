export interface Track {
    _id: string;
    title: string;
    duration: string;
    file: string;
}

export interface AlbumType {
    title: string;
    artist: string;
    year: string;
    description: string;
    styles: string[];
    tracks?: Track[];
}
