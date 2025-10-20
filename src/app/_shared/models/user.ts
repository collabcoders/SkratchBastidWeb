export class User {
    // Property (public by default)
    userId: number;
    appName: string;
    email: string;
    streamUrl: string;
    chatUrl: string;
    memberStreamUrl: string;
    memberChatUrl: string;
    bio: string;
    page: string;
    hlsUrl: string;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        userId: number,
        appName: string,
        email: string,
        streamUrl: string,
        chatUrl: string,
        memberStreamUrl: string,
        memberChatUrl: string,
        bio: string,
        page: string,
        hlsUrl: string
    ) {
        this.userId = userId;
        this.appName = appName;
        this.email = email;
        this.streamUrl = streamUrl;
        this.chatUrl = chatUrl;
        this.memberStreamUrl = memberStreamUrl;
        this.memberChatUrl = memberChatUrl;
        this.bio = bio;
        this.page = page;
        this.hlsUrl = hlsUrl;
    }
}

