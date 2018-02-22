import {formatProviderId, parseProviderId} from "./providerUtils";

describe("providerUtils", () => {
    describe(`${parseProviderId.name}`, () => {
        test("Should parse data", () => {
            expect(parseProviderId("tinder_foobar")).toEqual({provider: "tinder", id: "foobar"});
        });
    });

    describe(`${formatProviderId.name}`, () => {
        test("Should format data", () => {
            expect(formatProviderId({provider: "tinder", id: "foobar"})).toEqual("tinder_foobar");
        });
    });
});
