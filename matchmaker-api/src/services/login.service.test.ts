import {createSandbox, match} from "sinon";
import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import * as tinder from "../providers/tinder/tinder-client";
import {mockDatabaseForEach, stubRepositoryForEach} from "../testHelper";
import {checkCredentials, login, registerCredentials, registerTinderCredentials, Status} from "./login.service";

describe("services/login.service", () => {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    describe(`${login}`, () => {
        mockDatabaseForEach();

        test("First login: should initialize User and credentials", async () => {
            expect(await userRepositoryFactory().count()).toEqual(0); // first login

            const tinderUserId = "tinderUserId";
            const tinderToken = "tinderToken";
            sinon.stub(tinder, "getMeta").withArgs(tinderToken).resolves({user: {_id: tinderUserId}});

            const userId = await login("tinder", tinderToken);

            // user initialized
            const createdUser = await userRepositoryFactory().findOneById(userId);
            expect(createdUser).toBeDefined();
            expect(createdUser!.credentials.tinder).toBeDefined();
            expect(createdUser!.credentials.tinder!.token).toBe(tinderToken);
            expect(createdUser!.credentials.tinder!.userId).toBe(tinderUserId);
            // return
            expect(userId).toEqual(createdUser!.id.toHexString());
        });

        test("Existing user with provider already registered: should refresh secret", async () => {
            const tinderUserId = "tinderUserId";
            const getMetaStub = sinon.stub(tinder, "getMeta");

            // initialize
            const previousTinderToken = "previousTinderToken";
            getMetaStub.withArgs(previousTinderToken).resolves({user: {_id: tinderUserId}});
            const previousUserId = await login("tinder", previousTinderToken);

            // token refreshed
            const newTinderToken = "newTinderToken";
            getMetaStub.withArgs(newTinderToken).resolves({user: {_id: tinderUserId}});

            const newUserId = await login("tinder", newTinderToken); // initialize

            // User refreshed
            const updatedUser = await userRepositoryFactory().findOneById(newUserId);
            expect(updatedUser!.credentials.tinder!.token).toBe(newTinderToken);
            expect(updatedUser!.credentials.tinder!.userId).toBe(tinderUserId);
            // return
            expect(newUserId).toEqual(previousUserId);
        });
    });

    describe(`${registerCredentials}`, () => {
        const userRepositoryFactoryStub = stubRepositoryForEach("userRepositoryFactory");

        test("Throw 'NotFoundException' if unknown User", async () => {
            const userId = "unknown";
            userRepositoryFactoryStub.findOneById.withArgs(userId).resolves(null);

            await expect(registerCredentials(userId, "tinder", "any")).rejects.toThrow(NotFoundException);
        });

        describe(`${registerTinderCredentials}`, () => {
            it("Should initialize 'credentials.tinder' if first login", async () => {
                const userId = "userId";
                const secret = "secret";

                userRepositoryFactoryStub.findOneById.withArgs(userId).resolves({
                    credentials: {
                        once: {userId: "onceUserId", authorization: "onceAuthorization"},
                        // tinder: undefined
                    },
                });
                const tinderUserId = "tinderUserId";
                sinon.stub(tinder, "getMeta").withArgs(secret).resolves({user: {_id: tinderUserId}});

                await registerCredentials(userId, "tinder", secret);

                expect(userRepositoryFactoryStub.save.withArgs(match.any).called).toBe(true); // TODO
                // x.credentials!.tinder!.userId === tinderUserId
                // x.credentials!.tinder!.token === secret
            });

            it("Should refresh 'credentials.tinder' if already registered", async () => {
                const userId = "userId";
                const secret = "secret";

                userRepositoryFactoryStub.findOneById.withArgs(userId).resolves({
                    credentials: {
                        once: {userId: "onceUserId", authorization: "onceAuthorization"},
                        tinder: {userId: "tinderUserId", token: "tinderInitialToken"},
                    },
                });
                const tinderUserId = "tinderUserId";
                sinon.stub(tinder, "getMeta").withArgs(secret).resolves({user: {_id: tinderUserId}});

                await registerCredentials(userId, "tinder", secret);

                expect(userRepositoryFactoryStub.save.withArgs(match.any).called).toBe(true); // TODO
                // x.credentials!.tinder!.userId === tinderUserId
                // x.credentials!.tinder!.token === secret
            });
        });
    });

    describe(`${checkCredentials}`, () => {
        const userRepositoryFactoryStub = stubRepositoryForEach("userRepositoryFactory");

        test(`Should return '${Status.UP_TO_DATE}' if success`, async () => {
            const userId = "userId";
            const tinderToken = "tinderToken";
            userRepositoryFactoryStub.findOneById.withArgs(userId).resolves({
                credentials: {
                    tinder: {token: tinderToken},
                },
            });
            sinon.stub(tinder, "getMeta").withArgs(tinderToken).resolves({});

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.UP_TO_DATE);
        });

        test(`Should return '${Status.EXPIRED}' if unauthorized`, async () => {
            const userId = "userId";
            const tinderToken = "tinderToken";
            userRepositoryFactoryStub.findOneById.withArgs(userId).resolves({
                credentials: {
                    tinder: {token: tinderToken},
                },
            });
            sinon.stub(tinder, "getMeta").withArgs(tinderToken).rejects(new Error("401 Unauthorized"));

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.EXPIRED);
        });

        test(`Should return '${Status.NOT_REGISTERED}' if provider not registered`, async () => {
            const userId = "userId";
            userRepositoryFactoryStub.findOneById.withArgs(userId).resolves({
                credentials: {
                    // tinder: undefined
                },
            });

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.NOT_REGISTERED);
        });
    });
});
