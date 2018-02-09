import {replace, reset, when} from "testdouble";
import {userRepositoryFactory} from "../database/repositories";
import * as tinder from "../providers/tinder/tinder-client";
import {mockDatabase} from "../testHelper";
import {login} from "./login.service";

describe("user.service", () => {
    mockDatabase();

    afterEach(() => reset());

    describe(`${login}`, () => {
        test("First login: should initialize User and credentials", async () => {
            expect(await userRepositoryFactory().count()).toEqual(0); // first login

            const tinderUserId = "tinderUserId";
            const tinderToken = "tinderToken";
            const getMeta = replace(tinder, "getMeta");
            when(getMeta(tinderToken)).thenResolve({user: {_id: tinderUserId}});

            const userId = await login(tinderToken);

            // User initialized
            const createdUser = await userRepositoryFactory().findOneById(userId);
            expect(createdUser!.credentials.tinder!.token).toBe(tinderToken);
            expect(createdUser!.credentials.tinder!.userId).toBe(tinderUserId);
            // return
            expect(userId).toEqual(createdUser!.id.toHexString());
        });

        test("Already registered user: should refresh token", async () => {
            const tinderUserId = "tinderUserId";
            const getMeta = replace(tinder, "getMeta");

            // initialize
            const previousTinderToken = "previousTinderToken";
            when(getMeta(previousTinderToken)).thenResolve({user: {_id: tinderUserId}});
            const previousUserId = await login(previousTinderToken);

            // token refreshed
            const newTinderToken = "newTinderToken";
            when(getMeta(newTinderToken)).thenResolve({user: {_id: tinderUserId}});

            const newUserId = await login(newTinderToken); // initialize

            // User refreshed
            const updatedUser = await userRepositoryFactory().findOneById(newUserId);
            expect(updatedUser!.credentials.tinder!.token).toBe(newTinderToken);
            expect(updatedUser!.credentials.tinder!.userId).toBe(tinderUserId);
            // return
            expect(newUserId).toEqual(previousUserId);
        });
    });
});
