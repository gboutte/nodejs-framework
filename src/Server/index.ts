import * as http from "http"
import { Request } from '../Http/Request';
import { Router } from "../Routing/Router";

class Server {
    private server: http.Server;
    private router: Router;

    constructor() {
        this.router = new Router();
        this.requestListener = this.requestListener.bind(this);
        let self = this;
        this.server = http.createServer(this.requestListener);
    }
    requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
        let request = new Request(req);
        let self = this;
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            request.updateBody(body);
            self.router.handle(request, res);
        });
    }

    listen(port: number) {
        this.server.listen(port)
    }
}

export { Server }   