import {IMatch, IMessage, IPerson} from "../dto";
import OnceProvider from "./once/once-provider";
import TinderProvider from "./tinder/tinder-provider";

// TODO "any" to "Credentials"
export interface IProvider {
    getUserId(credentials: any): Promise<string>;

    getMatches(credentials: any): Promise<IMatch[]>;

    getProfile(credentials: any, personId: string): Promise<IPerson>;

    getMessagesByProfile(credentials: any, profileId: string): Promise<IMessage[]>;
}

export function getProvider(provider: string): IProvider {
    switch (provider) { // TODO Factory interface
        case "tinder":
            return new TinderProvider();
        case "once":
            return new OnceProvider();
        default:
            throw new UnsupportedProviderError(`Unknown provider ${provider}`);
    }
}

export function getProviders(): { [key: string]: IProvider } {
    return {
        once: new OnceProvider(),
        tinder: new TinderProvider(),
    };
}

export function getProviderIds(): string[] {
    return ["tinder", "once"];
}

export class UnsupportedProviderError extends Error {
    constructor(private provider: string) {
        super();
    }
}
