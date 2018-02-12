import {Server} from "http";
import {MongodHelper} from "mongodb-prebuilt";
import {tmpdir} from "os";
import {replace} from "testdouble";
import {connect, disconnect} from "./database/connection";
import {startServer} from "./server";

export function mockDatabaseForEach() {
    let helper: MongodHelper;

    beforeAll(async () => {
        const port = "27017"; // default
        replace(process.env, "MONGO_URL", `mongodb://localhost:${port}`);

        helper = new MongodHelper(["--port", port, "--dbpath", tmpdir()]);
        await helper.run();
        await connect();
    });

    afterAll(async () => {
        await disconnect();
        helper.mongoBin.childProcess.kill();
    });
}

export function startServerForEach() {
    let server: Server;
    beforeEach(() => server = startServer());
    afterEach(() => server.close());
}

export const BASE_URL = `http://localhost:${process.env.PORT || 8081}`;
