import {Match, Message, Person} from "../dto";
import OnceProvider from "./once/once-provider";
import TinderProvider from "./tinder/tinder-provider";

// TODO "any" to "Credentials"
export interface IProvider {
    getMatches(credentials: any): Promise<Match[]>;

    getProfile(credentials: any, personId: string): Promise<Person>;

    getMessagesByProfile(credentials: any, profileId: string): Promise<Message[]>;
}

export function getProvider(provider: string): IProvider {
    switch (provider) { // TODO Factory interface
        case  "tinder":
            return new TinderProvider();
        case  "once":
            return new OnceProvider();
        default:
            throw new Error(`Unknown provider ${provider}`);
    }
}

export class UnsupportedProviderError extends Error {
    constructor(private provider: string) {
        super();
    }
}
