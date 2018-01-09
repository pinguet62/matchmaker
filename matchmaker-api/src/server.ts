import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import {Application} from "express";
import "reflect-metadata";
import {connect} from "./database/connection";
import {exceptionHandler} from "./exceptions";
import {registerRoutes} from "./router";

start();

async function start() {
    await connect();

    const app: Application = express();

    app.use(cors());
    app.use(bodyParser.json());
    registerRoutes(app);
    app.use(exceptionHandler);

    app.listen(process.env.PORT || 8081);
}
