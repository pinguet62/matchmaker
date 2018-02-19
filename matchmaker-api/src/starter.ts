import "reflect-metadata";
import {connect} from "./database/connection";
import {startServer} from "./server/server";

(async () => {
    await connect();
    await startServer();
})();
