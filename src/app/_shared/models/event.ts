export class Event {
    // Property (public by default)
    eventId: number;
    title: string;
    location: string;
    url: string;
    image: string;
    date: string;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        eventId: number,
        title: string,
        location: string,
        url: string,
        image: string,
        date: string
    ) {
        this.eventId = eventId;
        this.title = title;
        this.location = location;
        this.url = url;
        this.image = image;
        this.date = date;
    }
}
