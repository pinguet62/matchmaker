import * as express from "express";
import {Application} from "express";
import {exceptionHandler} from "./exceptions";
import {registerRoutes} from "./router";

const app: Application = express();

registerRoutes(app);
app.use(exceptionHandler);

app.listen(process.env.PORT || 8081);
