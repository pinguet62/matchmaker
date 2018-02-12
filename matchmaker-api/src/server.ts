import {json} from "body-parser";
import * as cors from "cors";
import * as express from "express";
import {Application} from "express";
import {Server} from "http";
import {exceptionHandler} from "./exceptions";
import {registerRoutes} from "./router";

export function startServer(): Server {
    const app: Application = express();

    app.use(cors());
    app.use(json());
    registerRoutes(app);
    app.use(exceptionHandler);

    return app.listen((process.env.PORT || 8081) as number);
}
