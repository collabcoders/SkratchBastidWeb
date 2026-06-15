export class Ads {
    // Property (public by default)
    adId: number;
    title: string;
    alignment: string;
    description: string;
    url: string;
    seconds: number;
    order: number;
    image: string;
    // Optional video-creative URL (mp4). When set, the hero renders a muted
    // autoplaying video with `image` as its poster; otherwise `image` is shown.
    video?: string;
    button: string;
    category: string;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        adId: number,
        title: string,
        alignment: string,
        description: string,
        url: string,
        seconds: number,
        order: number,
        image: string,
        button: string,
        category: string
    ) {
        this.adId = adId;
        this.title = title;
        this.alignment = alignment;
        this.description = description;
        this.url = url;
        this.seconds = seconds;
        this.order = order;
        this.image = image;
        this.button = button;
        this.category = category;
    }
}
