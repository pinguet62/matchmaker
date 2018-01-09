import "reflect-metadata";
import {ObjectID} from "typeorm";
import {connect, disconnect} from "../src/database/connection";
import {SharedLink, User} from "../src/database/entities";
import {userRepositoryFactory} from "../src/database/repositories";

describe("TypeORM", () => {
    let generatedId: ObjectID | undefined;

    beforeAll(async () => {
        await connect();
    });

    it("save()", async () => {
        const sharedLink1 = new SharedLink();
        sharedLink1.link = "...";
        // sharedLink1.matchIds = ["a", "b"];

        const sharedLink2 = new SharedLink();
        sharedLink2.link = "...";
        // sharedLink2.matchIds = ["a", "b"];

        const user: User = new User();
        user.token = "any";
        user.sharedLinks = [sharedLink1, sharedLink2];

        await userRepositoryFactory().save(user);

        expect(user.id).not.toBeUndefined();

        generatedId = user.id;
    });

    it("find()", async () => {
        const user = await userRepositoryFactory().findOneById(generatedId);

        expect(user).not.toBeNull();
        expect(user.token).toBe("any");
        expect(user.sharedLinks).toHaveLength(2);
    });

    afterAll(async () => {
        await disconnect();
    });
});
