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
