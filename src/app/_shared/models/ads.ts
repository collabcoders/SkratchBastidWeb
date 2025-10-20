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
