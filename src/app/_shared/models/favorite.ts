export class Favorite {
    // Property (public by default)
    favId: number;
    itemId: number;
    section: string;
    title: string;
    artist: string;
    image: string;
    duration: string;
    type: string;
    hls: string;
    file: string;
    date: string;
    dateAdded: string;
    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        favId: number,
        itemId: number,
        section: string,
        title: string,
        artist: string,
        image: string,
        duration: string,
        type: string,
        hls: string,
        file: string,
        date: string,
        dateAdded: string
    ) {
        this.favId = favId;
        this.itemId = itemId;
        this.section = section;
        this.title = title;
        this.artist = artist;
        this.image = image;
        this.duration = duration;
        this.type = type;
        this.hls = hls;
        this.file = file;
        this.date = date;
        this.dateAdded = dateAdded
    }
}
