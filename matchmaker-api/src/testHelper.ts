import {Server} from "http";
import {MongodHelper} from "mongodb-prebuilt";
import {tmpdir} from "os";
import {createSandbox, SinonStub} from "sinon";
import {connect, disconnect} from "./database/connection";
import * as repositories from "./database/repositories";
import {startServer} from "./server/server";

export function mockDatabaseForEach() {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    let helper: MongodHelper;

    const port = "27017"; // default
    beforeEach(() => sinon.stub(process, "env").value({...process.env, MONGO_URL: `mongodb://localhost:${port}`}));
    beforeEach(async () => {
        helper = new MongodHelper(["--port", port, "--dbpath", tmpdir()]);
        await helper.run();
        await connect();
    }, 10000); // first "mongodb-prebuilt" execution download & install MongoDb

    afterEach(async () => {
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

/** @returns Fake instance of {@link module:typeorm~Repository}, where supported functions are {@link module:sinon~SinonStub}. */
export function stubRepositoryForEach(repository: string): () => { findOneById: SinonStub, save: SinonStub } {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    let findOneById: SinonStub;
    let save: SinonStub;

    beforeEach(() => {
        findOneById = sinon.stub();
        save = sinon.stub().resolves(42);
        sinon
            .stub(repositories, repository as "userRepositoryFactory") // force cast with any key
            .returns({findOneById, save});
    });

    return () => {
        return {findOneById, save};
    };
}
