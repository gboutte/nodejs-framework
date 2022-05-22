import { Message } from "../Message";

class Response extends Message {
    private statusCode: number;


    constructor(body: string = '', statusCode: number = 200) {
        super();
        this.setBody(body);
        this.statusCode = 200;
    }



}
export { Response }