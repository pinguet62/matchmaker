import {getConnections, getMatch, getMessagesByMatch} from "./once";

const authorization = "";
const matchId = "";

describe.skip("once", () => {
    test(getConnections.name, async () => {
        const result = await getConnections(authorization);

        expect(Array.isArray(result)).toBe(true);
        expect(result).not.toHaveLength(0);
        for (const it of result) {
            expect(it).toHaveProperty("user");
        }
    });

    test(getMessagesByMatch.name, async () => {
        const result = await getMessagesByMatch(authorization, matchId);

        expect(Array.isArray(result)).toBe(true);
        expect(result).not.toHaveLength(0);
        for (const it of result) {
            expect(it).toHaveProperty("id");
            expect(it).toHaveProperty("sender_id");
            expect(it).toHaveProperty("receiver_id");
            expect(it).toHaveProperty("message");
            expect(it).toHaveProperty("created_at");
        }
    });

    test(getMatch.name, async () => {
        const result = await getMatch(authorization, matchId);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("number");
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("user.id");
        expect(result).toHaveProperty("user.first_name");
    });
});
