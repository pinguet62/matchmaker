import {getMatches, getMessagesByMatch, getMeta, getUser} from "./tinder-client";

const token = "";
const userId = "";
const matchId = "";

describe.skip("tinder", () => {
    test(`${getMeta}`, async () => {
        const result = await getMeta(token);

        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("user._id");
        expect(result).toHaveProperty("user.name");
    });

    test(`${getUser}`, async () => {
        const result = await getUser(token, userId);

        expect(result).toHaveProperty("_id");
        expect(result).toHaveProperty("bio");
        expect(result).toHaveProperty("birth_date");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("photos");
        expect(result).toHaveProperty("jobs");
        expect(result).toHaveProperty("schools");
        expect(result).toHaveProperty("distance_mi");
    });

    test(`${getMatches}`, async () => {
        const result = await getMatches(token);

        expect(Array.isArray(result)).toBe(true);
        expect(result).not.toHaveLength(0);
        for (const it of result) {
            expect(it).toHaveProperty("_id");
            expect(it).toHaveProperty("messages");
            expect(it).toHaveProperty("person");
            expect(it).toHaveProperty("person._id");
            expect(it).toHaveProperty("person.name");
        }
    });

    test(`${getMessagesByMatch}`, async () => {
        const result = await getMessagesByMatch(token, matchId);

        expect(Array.isArray(result)).toBe(true);
        expect(result).not.toHaveLength(0);
        for (const it of result) {
            expect(it).toHaveProperty("_id");
            expect(it).toHaveProperty("from");
            expect(it).toHaveProperty("to");
            expect(it).toHaveProperty("message");
            expect(it).toHaveProperty("sent_date");
        }
    });
});
