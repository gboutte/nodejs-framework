import { IncomingMessage } from "http";
import { Message } from "../Message";

class Request extends Message {
    private request: IncomingMessage;

    constructor(req: IncomingMessage) {
        super();
        this.request = req;
    }
}

export { Request }