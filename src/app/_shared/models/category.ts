export class Category {
    // Property (public by default)
    value: string;
    name: string;
    subTitle: string;
    description: string;

    // Constructor
    // (accepts a value so you can initialize engine)
    constructor(
        value: string,
        name: string,
        subTitle: string,
        description: string
    ) {
        this.value = value;
        this.name = name;
        this.subTitle = subTitle;
        this.description = description;
    }
}
