import { IncomingMessage } from "http";
import { Message } from "../Message";

class Request extends Message {
    private request: IncomingMessage;

    private method: string;
    private cookies: Map<string, string> = new Map<string, string>();
    // private files: Map<string, UploadedFile>;
    private uri: any;
    private bodyParsed: Map<string, any> = new Map<string, any>();


    constructor(req: IncomingMessage) {
        super();
        this.request = req;

        // Method part
        this.method = this.request.method ?? '';

        // Headers
        this.loadHeaders(req)

        // Cookies
        this.loadCookies(req);
    }

    private loadHeaders(req: IncomingMessage) {
        let headers = this.request.headers;
        for (let headerName in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
                this.addHeader(headerName, (headers[headerName] ?? "").toString());
            }
        }
    }

    private loadCookies(req: IncomingMessage) {

        let cookies = this.getHeader('Cookie');
        if (cookies === undefined) {
            cookies = this.getHeader('cookie');
        }

        if (cookies !== undefined) {
            cookies.split(';')
                .map(v => v.split('='))
                .map(cookie => this.addCookie(
                    decodeURIComponent(cookie[0].trim()),
                    decodeURIComponent(cookie[1].trim())
                ));
        }
    }

    public updateBody(body: string) {
        this.setBody(body);
        this.loadBody();
    }
    private loadBody() {
        let contentType = this.getHeader('Content-Type');
        if (contentType !== undefined && this.getBody() !== null) {
            switch (contentType) {
                case 'application/x-www-form-urlencoded':
                    this.processFormUrlEncoded();
                    break;


                case 'application/json':
                    this.processJson();
                    break;
                default:
                    //Test multipart/form-data
                    let regex = new RegExp('multipart/form-data; boundary=(?<boundary>.*)$');
                    let result = regex.exec(contentType);

                    if (result) {
                        let boundary = result.groups?.boundary;
                        if (boundary) {
                            this.processMultipartFormData(boundary);
                        }
                    }

            }

        }

    }
    private processJson() {
        let parameters = JSON.parse(this.getBody());
        for (let name in parameters) {
            this.bodyParsed.set(name, parameters[name])
        }
    }
    private processMultipartFormData(boundary: string) {

        let lines = this.getBody().split('\r\n');
        let started = false;

        let parts: string[][] = []

        //Part 1 - Getting each part of the body
        let currentPart: string[] = [];
        for (let line of lines) {
            if (line === '--' + boundary + '--') {
                if (started) {
                    parts.push(currentPart);
                    currentPart = [];
                }
            } else if (line === '--' + boundary) {
                if (started) {
                    parts.push(currentPart);
                    currentPart = [];
                }
                started = true;
            } else {
                if (started) {
                    currentPart.push(line);
                }
            }
        }

        //Part 2 - Parsing each body part
        for (let part of parts) {
            let headers: Map<string, string> = new Map<string, string>();

            let isContent = false;
            let content: string[] = [];
            for (let line of part) {
                if (!isContent && line === '') {
                    isContent = true;
                } else {
                    if (isContent) {
                        content.push(line);
                    } else {
                        let headerParts = line.split(':');
                        headers.set(headerParts[0].toLowerCase().trim(), headerParts[1]);
                    }
                }
            }

            let contentValue = content.join('\r\n')

            // Part 3 - parsing the Content-Disposition "header"
            let dispositions: Map<string, string> = new Map<string, string>();
            let dispositionParts = headers.get('content-disposition')?.split(';');

            if (dispositionParts !== undefined) {
                for (let param of dispositionParts) {
                    let regexResult = /(?<name>[^=]*)="(?<value>.*)"$/.exec(param.trim())
                    if (regexResult?.groups?.name !== undefined && regexResult?.groups?.value !== undefined) {
                        dispositions.set(regexResult?.groups?.name, regexResult?.groups?.value)
                    }
                }

                // Part 4 - Interpreting the "headers" to add the parameters
                let name = dispositions.get('name');
                if (name !== undefined) {
                    let filename = dispositions.get('filename');

                    if (filename === undefined) {
                        this.bodyParsed.set(name, contentValue);
                    } else {
                        // @todo add an uploaded file
                    }
                }
            }
        }
    }

    private processFormUrlEncoded() {
        this.getBody().split('&')
            .map(v => v.split('='))
            .map(param => this.bodyParsed.set(
                decodeURIComponent(param[0].trim()),
                decodeURIComponent(param[1].trim())
            ));
    }

    private loadFiles(req: IncomingMessage) {

    }

    getCookies(): Map<string, string> {
        return this.cookies;
    }
    hasCookie(name: string) {
        return this.cookies.has(name);
    }
    addCookie(name: string, value: string) {
        this.cookies.set(name, value);
    }
    removeCookie(name: string) {
        this.cookies.delete(name);
    }
    getCookie(name: string) {
        return this.cookies.get(name);
    }
}

export { Request }