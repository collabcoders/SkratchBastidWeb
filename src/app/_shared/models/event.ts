export class Event {
    eventId: number;
    category?: string;
    title: string;
    location: string;
    url?: string;
    tickets?: string;
    image?: string;
    date?: string;
    youtubeId?: string;
    calendars?: number;
    views?: number;
    description?: string;
    details?: string;

    constructor(
        eventId: number,
        title: string,
        location: string,
        category?: string,
        url?: string,
        tickets?: string,
        image?: string,
        date?: string,
        youtubeId?: string,
        calendars?: number,
        views?: number,
        description?: string,
        details?: string
    ) {
        this.eventId = eventId;
        this.title = title;
        this.location = location;
        this.category = category;
        this.url = url;
        this.tickets = tickets;
        this.image = image;
        this.date = date;
        this.youtubeId = youtubeId;
        this.calendars = calendars;
        this.views = views;
        this.description = description;
        this.details = details;
    }
}
