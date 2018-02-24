import {ICredentials} from "../database/entities";
import {IMatch, IMessage, IPerson} from "../dto";
import OnceProviderAction from "./once/once-providerAction";
import {providerFactory, ProviderKey} from "./provider";
import TinderProviderAction from "./tinder/tinder-providerAction";

export interface IProviderAction {
    getUserId(secret: string): Promise<string>;

    getMatches(credentials: ICredentials): Promise<IMatch[]>;

    getProfile(credentials: ICredentials, personId: string): Promise<IPerson>;

    getMessagesByProfile(credentials: ICredentials, profileId: string): Promise<IMessage[]>;
}

export function getProviderAction(providerKey: ProviderKey): IProviderAction {
    return providerFactory<IProviderAction>(providerKey, {
        once: () => new OnceProviderAction(),
        tinder: () => new TinderProviderAction(),
    });
}

// TODO remove
// export function getProviderActions(): { [key: string]: IProviderAction } {
//     return {
//         once: new OnceProviderAction(),
//         tinder: new TinderProviderAction(),
//     };
// }
