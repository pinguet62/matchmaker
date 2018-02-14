import {Server} from "http";
import {MongodHelper} from "mongodb-prebuilt";
import {tmpdir} from "os";
import {createSandbox, SinonStub} from "sinon";
import {connect, disconnect} from "./database/connection";
import * as repositories from "./database/repositories";
import {startServer} from "./server";

export function mockDatabaseForEach() {
    const sinon = createSandbox();

    let helper: MongodHelper;

    const port = "27017"; // default
    beforeEach(() => sinon.stub(process, "env").value({...process.env, MONGO_URL: `mongodb://localhost:${port}`}));
    beforeEach(async () => {
        helper = new MongodHelper(["--port", port, "--dbpath", tmpdir()]);
        await helper.run();
        await connect();
    });

    afterEach(async () => {
        await disconnect();
        helper.mongoBin.childProcess.kill();
    });
    afterEach(() => sinon.restore());
}

export function startServerForEach() {
    let server: Server;
    beforeEach(() => server = startServer());
    afterEach(() => server.close());
}

export const BASE_URL = `http://localhost:${process.env.PORT || 8081}`;

/** @returns Fake instance of {@link module:typeorm~Repository}, where supported functions are {@link module:sinon~SinonStub}. */
export function stubRepositoryForEach(repository: string): { findOneById: SinonStub, save: SinonStub } {
    const sinon = createSandbox();

    let findOneById: SinonStub = sinon.stub();
    let save: SinonStub = sinon.stub();

    const repositoryStub = {findOneById, save};

    beforeEach(() => {
        findOneById = sinon.stub();
        save = sinon.stub();
        sinon
            .stub(repositories, repository as "userRepositoryFactory") // force cast with any key
            .returns(repositoryStub);
    });

    afterEach(() => sinon.restore());

    return repositoryStub;
}
