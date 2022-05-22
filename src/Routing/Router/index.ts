import { Request } from "../../Http/Request";
import * as http from "http"
import { Response } from "../../Http/Response";
import { File } from "../../Http/File";

class Router {
    constructor() {
    }

    handle(request: Request, res: http.ServerResponse) {
        let response = new Response('My response');
        this.executeResponse(res, response);
    }
    private executeResponse(res: http.ServerResponse, response: Response) {
        res.writeHead(200);
        res.end(response.getBody());
    }
}

export { Router }