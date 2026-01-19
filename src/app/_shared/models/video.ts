export class Video {
    // Core fields
    videoId: number;
    title: string;
    category: string;
    source: string;
    sourceId: string;
    duration: string;
    image: string;
    screenshot: string;
    thumbnail?: string;
    hls: string;
    date: string;

    // Optional metadata
    featuring?: string | null;
    audio1?: string;
    url?: string;
    file?: string;
    comments?: number;
    favId?: number;
    featured?: number;

    constructor(init: Partial<Video> = {}) {
        this.videoId = init.videoId ?? 0;
        this.title = init.title ?? '';
        this.category = init.category ?? '';
        this.source = init.source ?? '';
        this.sourceId = init.sourceId ?? '';
        this.duration = init.duration ?? '';
        this.image = init.image ?? '';
        this.screenshot = init.screenshot ?? '';
        this.thumbnail = init.thumbnail ?? '';
        this.hls = init.hls ?? '';
        this.date = init.date ?? '';

        this.featuring = init.featuring ?? null;
        this.audio1 = init.audio1 ?? '';
        this.url = init.url ?? '';
        this.file = init.file ?? '';
        this.comments = init.comments ?? 0;
        this.favId = init.favId ?? 0;
        this.featured = init.featured ?? 0;
    }
}
