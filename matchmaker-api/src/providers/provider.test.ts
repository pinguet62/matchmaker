import {createSandbox} from "sinon";
import {Credentials, ICredentials} from "../database/entities";
import {IMatch} from "../dto";
import OnceProviderAction from "./once/once-providerAction";
import {forEachProvider, formatProviderId, IProviderId, parseProviderId, providerFactory} from "./provider";
import {IProviderAction} from "./providerAction";
import TinderProviderAction from "./tinder/tinder-providerAction";

describe("provider", () => {
    const sinon = createSandbox();
    afterEach(() => sinon.restore());

    describe(`${parseProviderId.name}`, () => {
        test("Should parse data", () => {
            expect(parseProviderId("tinder_foobar")).toEqual({providerKey: "tinder", id: "foobar"} as IProviderId);
        });
    });

    describe(`${formatProviderId.name}`, () => {
        test("Should format data", () => {
            expect(formatProviderId({providerKey: "tinder", id: "foobar"})).toEqual("tinder_foobar");
        });
    });

    describe(`${providerFactory.name}`, () => {
        test("Should execute only corresponding function and return its result", () => {
            const onceFct = sinon.stub();
            const tinderFct = sinon.stub().returns("42");

            const result = providerFactory("tinder", {
                once: onceFct,
                tinder: tinderFct,
            });

            // only corresponding function
            expect(onceFct.called).toBe(false);
            expect(tinderFct.called).toBe(true);
            // return its result
            expect(result).toEqual("42");
        });
    });

    describe(`${forEachProvider.name}`, () => {
        test("Should call each 'registered' provider and return 'concatenated' results", async () => {
            const userCredentials = {
                once: {authorization: "onceAuthorization"},
                tinder: {token: "tinderToken"},
            } as Credentials;
            sinon.stub(OnceProviderAction.prototype, "getMatches").resolves(["once1", "once2"]);
            sinon.stub(TinderProviderAction.prototype, "getMatches").resolves(["tinder1", "tinder2"]);

            const result: IMatch[] = await forEachProvider(
                userCredentials,
                (providerAction: IProviderAction, credentials: ICredentials) => providerAction.getMatches(credentials),
            );

            expect(result).toContain("once1");
            expect(result).toContain("once2");
            expect(result).toContain("tinder1");
            expect(result).toContain("tinder2");
        });
    });
});
