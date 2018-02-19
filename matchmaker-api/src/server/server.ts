import {json} from "body-parser";
import * as cors from "cors";
import * as express from "express";
import {Application} from "express";
import {Server} from "http";
import exceptionMiddleware from "./exceptionMiddleware";
import router from "./router";

export function startServer(): Server {
    const app: Application = express();

    app.use(cors());
    app.use(json());
    app.use(router);
    app.use(exceptionMiddleware);

    return app.listen((process.env.PORT || 8081) as number);
}
