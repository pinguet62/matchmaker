import {function as tdFunction, matchers, replace, reset, verify, when} from "testdouble";
import {User} from "../database/entities";
import * as repositories from "../database/repositories";
import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import * as tinder from "../providers/tinder/tinder-client";
import {mockDatabaseForEach} from "../testHelper";
import {checkCredentials, login, registerCredentials, registerTinderCredentials, Status} from "./login.service";

describe("services/login.service", () => {
    describe(`${login}`, () => {
        mockDatabaseForEach();

        test("First login: should initialize User and credentials", async () => {
            expect(await userRepositoryFactory().count()).toEqual(0); // first login

            const tinderUserId = "tinderUserId";
            const tinderToken = "tinderToken";
            const getMeta = replace(tinder, "getMeta");
            when(getMeta(tinderToken)).thenResolve({user: {_id: tinderUserId}});

            const userId = await login("tinder", tinderToken);

            // User initialized
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
            const getMeta = replace(tinder, "getMeta");

            // initialize
            const previousTinderToken = "previousTinderToken";
            when(getMeta(previousTinderToken)).thenResolve({user: {_id: tinderUserId}});
            const previousUserId = await login("tinder", previousTinderToken);

            // token refreshed
            const newTinderToken = "newTinderToken";
            when(getMeta(newTinderToken)).thenResolve({user: {_id: tinderUserId}});

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
        let findOneById: any;
        let save: any;
        beforeEach(() => {
            const propositionRepositoryFactory = replace(repositories, "userRepositoryFactory");
            findOneById = tdFunction();
            save = tdFunction();
            when(propositionRepositoryFactory()).thenReturn({findOneById, save});
        });
        afterEach(() => reset());

        test("Throw 'NotFoundException' if unknown User", async () => {
            const userId = "unknown";
            when(findOneById(userId)).thenResolve(null);

            await expect(registerCredentials(userId, "tinder", "any")).rejects.toThrow(NotFoundException);
        });

        describe(`${registerTinderCredentials}`, () => {
            it("Should initialize 'credentials.tinder' if first login", async () => {
                const userId = "userId";
                const secret = "secret";

                when(findOneById(userId)).thenResolve({
                    credentials: {
                        once: {userId: "onceUserId", authorization: "onceAuthorization"},
                        // tinder: undefined
                    },
                });
                const tinderUserId = "tinderUserId";
                const getMeta = replace(tinder, "getMeta");
                when(getMeta(secret)).thenResolve({user: {_id: tinderUserId}});

                await registerCredentials(userId, "tinder", secret);

                verify(save(matchers.argThat((x: User) =>
                    x.credentials!.tinder!.userId === tinderUserId &&
                    x.credentials!.tinder!.token === secret,
                )));
            });

            it("Should refresh 'credentials.tinder' if already registered", async () => {
                const userId = "userId";
                const secret = "secret";

                when(findOneById(userId)).thenResolve({
                    credentials: {
                        once: {userId: "onceUserId", authorization: "onceAuthorization"},
                        tinder: {userId: "tinderUserId", token: "tinderInitialToken"},
                    },
                });
                const tinderUserId = "tinderUserId";
                const getMeta = replace(tinder, "getMeta");
                when(getMeta(secret)).thenResolve({user: {_id: tinderUserId}});

                await registerCredentials(userId, "tinder", secret);

                verify(save(matchers.argThat((x: User) =>
                    x.credentials!.tinder!.userId === tinderUserId &&
                    x.credentials!.tinder!.token === secret,
                )));
            });
        });
    });

    describe(`${checkCredentials}`, () => {
        let findOneById: any;
        let getMeta: any;
        beforeEach(() => {
            const propositionRepositoryFactory = replace(repositories, "userRepositoryFactory");
            findOneById = tdFunction();
            when(propositionRepositoryFactory()).thenReturn({findOneById});

            getMeta = replace(tinder, "getMeta");
        });
        afterEach(() => reset());

        test(`Should return '${Status.UP_TO_DATE}' if success`, async () => {
            const userId = "userId";
            const tinderToken = "tinderToken";
            when(findOneById(userId)).thenResolve({
                credentials: {
                    tinder: {token: tinderToken},
                },
            });
            when(getMeta(tinderToken)).thenResolve({});

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.UP_TO_DATE);
        });

        test(`Should return '${Status.EXPIRED}' if unauthorized`, async () => {
            const userId = "userId";
            const tinderToken = "tinderToken";
            when(findOneById(userId)).thenResolve({
                credentials: {
                    tinder: {token: tinderToken},
                },
            });
            when(getMeta(tinderToken)).thenReject(new Error("401 Unauthorized"));

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.EXPIRED);
        });

        test(`Should return '${Status.NOT_REGISTERED}' if provider not registered`, async () => {
            const userId = "userId";
            when(findOneById(userId)).thenResolve({
                credentials: {
                    // tinder: undefined
                },
            });

            const status = await checkCredentials(userId);

            expect(status.tinder).toBe(Status.NOT_REGISTERED);
        });
    });
});
