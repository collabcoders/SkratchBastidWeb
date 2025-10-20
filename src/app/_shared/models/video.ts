import { fetchFile } from "wavesurfer.js/src/util";

export class Video {
    // Property (public by default)
    videoId: number;
    title: string;
    category: string;
    source: string;
    sourceId: string;
    audio1: string;
    duration: string;
    featuring: string;
    image: string;
    screenshot: string;
    hls: string;
    date: string;
    favId: number;
    featured: number;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        videoId: number,
        title: string,
        category: string,
        source: string,
        sourceId: string,
        audio1: string,
        duration: string,
        featuring: string,
        image: string,
        screenshot: string,
        hls: string,
        date: string,
        favId: number,
        featured: number
    ) {
        this.videoId = videoId;
        this.title = title;
        this.category = category;
        this.source = source;
        this.sourceId = sourceId;
        this.audio1 = audio1;
        this.duration = duration;
        this.featuring = featuring;
        this.image = image;
        this.screenshot = screenshot;
        this.hls = hls;
        this.date = date;
        this.favId = favId;
        this.featured = featured;
    }
}
