export class Profile {
    // Property (public by default)
    memberId: number;
    firstName: string;
    lastName: string;
    alias: string;
    email: string;
    phone: string;
    sms: boolean;
    password: string;
    confirmPassword: string;
    country: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    plan: string;
    cc: string;
    image: string;
    customerId: string;
    beatTransactionId: string;
    subscriptionId: string;
    paymentId: string;
    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        memberId: number,
        firstName: string,
        lastName: string,
        alias: string,
        email: string,
        phone: string,
        sms: boolean,
        password: string,
        confirmPassword: string,
        country: string,
        address1: string,
        address2: string,
        city: string,
        state: string,
        zip: string,
        plan: string,
        cc: string,
        image: string,
        customerId: string,
        beatTransactionId: string,
        subscriptionId: string,
        paymentId: string,
    ) {
        this.memberId = memberId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.email = email;
        this.phone = phone;
        this.sms = sms;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.country = country;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.plan = plan;
        this.cc = cc;
        this.image = image;
        this.customerId = customerId;
        this.beatTransactionId = beatTransactionId;
        this.subscriptionId = subscriptionId;
        this.paymentId = paymentId;
    }
}