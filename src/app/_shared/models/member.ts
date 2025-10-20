export class Member {
    // Property (public by default)
    memberId: number;
    email: string;
    firstName: string;
    lastName: string;
    plan: string;
    status: string;
    image: string;
    alias: string;
    renewal: Date;
    beats: boolean;
    token: string;
    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        memberId: number,
        email: string,
        firstName: string,
        lastName: string,
        plan: string,
        status: string,
        image: string,
        alias: string,
        renewal: Date,
        beats: boolean,
        token: string
    ) {
        this.memberId = memberId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.plan = plan;
        this.status = status;
        this.image = image;
        this.alias = alias;
        this.renewal = renewal;
        this.beats = beats;
        this.token = token;
    }
}
