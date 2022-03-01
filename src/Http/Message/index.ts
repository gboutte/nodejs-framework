abstract class Message {
    protected body: string;
    constructor() {
        this.body = '';
    }

    getBody() {
        return this.body;
    }
}

export { Message }