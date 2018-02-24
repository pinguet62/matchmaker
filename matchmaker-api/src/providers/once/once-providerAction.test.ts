import {createSandbox} from "sinon";
import {OnceCredentials} from "../../database/entities";
import {IMatch} from "../../dto";
import {getMatches} from "../tinder/tinder-client";
import * as onceClient from "./once-client";
import {IConnectionResults} from "./once-client";
import OnceProviderAction from "./once-providerAction";

describe("providers/once/once-provider", () => {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    describe(`${OnceProviderAction.name}`, () => {
        describe(`${getMatches.name}`, () => {
            test("Should for photo URL", async () => {
                sinon.stub(onceClient, "getConnections").resolves({
                    base_url: "https://d110abryny6tab.cloudfront.net/pictures",
                    connections: [
                        {
                            last_message: "Vous avez été connectés",
                            last_message_id: 0,
                            match_id: "MATCHID",
                            message_sent_at: 1513528924,
                            sender_id: "MATCHID",
                            user: {
                                age: 42,
                                education: [],
                                first_name: "FIRSTNAME",
                                id: "USERID",
                                occupation: {
                                    employer: null,
                                    position: null,
                                },
                                pictures: [
                                    {id: "PHOTOID", original: "PHOTOID_original.jpg"},
                                ],
                            },
                        },
                    ],
                } as IConnectionResults);

                const result: IMatch[] = await new OnceProviderAction().getMatches(sinon.createStubInstance(OnceCredentials));

                expect(result[0].person.photo).toEqual("https://d110abryny6tab.cloudfront.net/pictures/USERID/PHOTOID_original.jpg");
            });

            /** @see IConnectionDto#last_message_id */
            test("When not yet exchanged a message, should not generate 'lastMessage'", async () => {
                sinon.stub(onceClient, "getConnections").resolves({
                    base_url: "https://d110abryny6tab.cloudfront.net/pictures",
                    connections: [
                        {
                            last_message: "Vous avez été connectés",
                            last_message_id: 0,
                            match_id: "MATCHID",
                            message_sent_at: 1513528924,
                            sender_id: "MATCHID",
                            user: {
                                age: 42,
                                education: [],
                                first_name: "FIRSTNAME",
                                id: "USERID",
                                occupation: {
                                    employer: null,
                                    position: null,
                                },
                                pictures: [
                                    {id: "PHOTOID", original: "PHOTOID_original.jpg"},
                                ],
                            },
                        },
                    ],
                } as IConnectionResults);

                const result: IMatch[] = await new OnceProviderAction().getMatches(sinon.createStubInstance(OnceCredentials));

                expect(result[0].lastMessage).toBeUndefined();
            });
        });
    });
});
