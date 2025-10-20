export class Comment {
    commentId: number;
    userId: number;
    memberId: number;
    itemId: number;
    section: string;
    comment: string;
    image: string;
    name: string;
    like: number;
    date: Date | any;
    constructor(
        commentId: number = 0,
        userId: number = 0,
        memberId: number = 0,
        itemId: number = 0,
        section: string = '',
        name: string = '',
        comment: string = '',
        image: string = '',
        like: number = 0,
        date: Date = new Date(),
    ) {
        this.commentId = commentId;
        this.userId = userId;
        this.memberId = memberId;
        this.itemId = itemId;
        this.section = section;
        this.comment = comment;
        this.name = name;
        this.image = image;
        this.like = like;
        this.date = date;
    }
}
