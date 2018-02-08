import {Match, Message, Person} from "../dto";
import TinderProvider from "./tinder/tinder-provider";
import OnceProvider from "./once/once-provider";

// TODO "any" to "Credentials"
export interface IProvider {
    getMatches(credentials: any): Promise<Match[]>;

    getProfile(credentials: any, personId: string): Promise<Person>;

    getMessagesByProfile(credentials: any, profileId: string): Promise<Message[]>;
}

export function getProvider(provider: string): IProvider {
    switch (provider) {
        case  "tinder":
            return new TinderProvider();
        case  "once":
            return new OnceProvider();
        default:
            throw new Error(`Unknown provider ${provider}`);
    }
}
