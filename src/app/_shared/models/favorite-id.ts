export class FavoriteId {
    // Property (public by default)
    favId: number;
    itemId: number;
    section: string;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        favId: number,
        itemId: number,
        section: string
    ) {
        this.favId = favId;
        this.itemId = itemId;
        this.section = section;
    }
}
