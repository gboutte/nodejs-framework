import { Message } from "../Message";

class Response extends Message {
    constructor(body: string = '') {
        super();
        this.body = body
    }
}
export { Response }