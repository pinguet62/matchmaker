import {getConnections, getMatch, getMessagesByMatch} from "./once-client";

const authorization = "";
const matchId = "";

describe.skip("providers/once/once-client", () => {
    test(`${getConnections}`, async () => {
        const result = await getConnections(authorization);

        expect(result).toHaveProperty("connections");
        expect(Array.isArray(result.connections)).toBe(true);
        expect(result.connections).not.toHaveLength(0);
        for (const it of result.connections) {
            expect(it).toHaveProperty("user");
        }
        expect(result).toHaveProperty("base_url");
    });

    test(`${getMessagesByMatch}`, async () => {
        const result = await getMessagesByMatch(authorization, matchId);

        expect(Array.isArray(result)).toBe(true);
        expect(result).not.toHaveLength(0);
        for (const it of result) {
            expect(it).toHaveProperty("id");
            expect(it).toHaveProperty("sender_id");
            expect(it).toHaveProperty("message");
            expect(it).toHaveProperty("created_at");
        }
    });

    test(`${getMatch}`, async () => {
        const result = await getMatch(authorization, matchId);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("number");
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("user.id");
        expect(result).toHaveProperty("user.first_name");
    });
});
