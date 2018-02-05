import {MongodHelper} from "mongodb-prebuilt";
import {tmpdir} from "os";
import {replace, reset} from "testdouble";
import {connect, disconnect} from "./database/connection";

export function mockDatabase() {
    let helper: MongodHelper;

    beforeAll(async () => {
        const port = 27017; // default
        replace(process.env, "MONGO_URL", `mongodb://localhost:${port}`);

        helper = new MongodHelper(["--port", port, "--dbpath", tmpdir()]);
        await helper.run();
        await connect();
    });

    afterAll(async () => {
        await disconnect();
        helper.mongoBin.childProcess.kill();

        afterEach(() => reset());
    });
}
