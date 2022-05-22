abstract class Message {
    private body: string;
    private headers: Map<string, string> = new Map<string, string>();
    private protocol: string = '1.1';


    constructor() {
        this.body = '';
    }

    getBody() {
        return this.body;
    }
    setBody(body: string) {
        this.body = body;
    }

    getHeaders(): Map<string, string> {
        return this.headers;
    }
    hasHeader(name: string) {
        return this.headers.has(name.toLowerCase());
    }
    addHeader(name: string, value: string) {
        this.headers.set(name.toLowerCase(), value);
    }
    removeHeader(name: string) {
        this.headers.delete(name.toLowerCase());
    }
    getHeader(name: string) {
        return this.headers.get(name.toLowerCase());
    }
    getProtocol() {
        this.protocol;
    }
}

export { Message }