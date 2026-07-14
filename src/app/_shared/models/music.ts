export class Music {
    // Property (public by default)
    musicId: number;
    artist: string;
    title: string;
    genre: string;
    duration: string;
    image: string;
    file: string;
    date: string;
    description: string;
    category: string;
    index: number;
    favId: number;
    featured: number;
    external: boolean;
    href: string;
    url: string;

    // Optional pointer to the backing media for downloads. Video audio-versions
    // reuse musicId as the videoId for card play/pause toggling, so the real
    // id/type/version the /api/download endpoint needs live here. Absent for
    // ordinary music tracks (which download as type 'audio' by their musicId).
    mediaRef?: { type: 'video' | 'audio'; id: number; version?: 'audio' | 'audio1' | 'audio2' };

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        musicId: number,
        artist: string,
        title: string,
        genre: string,
        duration: string,
        image: string,
        file: string,
        date: string,
        description: string,
        category: string,
        index: number,
        favId: number,
        featured: number,
        href: string,
        external: boolean,
        url: string,
    ) {
        this.musicId = musicId;
        this.artist = artist;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.image = image;
        this.file = file;
        this.date = date;
        this.description = description;
        this.category = category;
        this.index = index;
        this.favId = favId;
        this.featured = featured;
        this.href = href;
        this.external = external;
        this.url = url;
    }
}
