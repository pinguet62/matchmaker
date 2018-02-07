import {Match, Message, Person} from "../dto";
import TinderProvider from "./tinder/tinder-provider";

// TODO "any" to "Credentials"
export interface IProvider {
    getMatches(credentials: any): Promise<Match[]>;

    getProfile(credentials: any, personId: string): Promise<Person>;

    getMessagesByProfile(credentials: any, profileId: string): Promise<Message[]>;
}

export function getProvider(provider: string): IProvider {
    if (provider === "tinder") {
        return new TinderProvider();
    }
    throw new Error(`Unknown provider ${provider}`);
}
