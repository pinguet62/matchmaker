import {userRepositoryFactory} from "../database/repositories";
import {IMatch, IMessage, IPerson} from "../dto";
import {NotFoundException} from "../exceptions";
import {getProvider, getProviderIds} from "../providers/provider";
import {parseProviderId} from "../providers/providerUtils";

export async function getMatchesByUserSharedLinkLink(sharedLinkLink: string): Promise<IMatch[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = await userRepositoryFactory().findSharedLinkBySharedLinkLink(sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    // TODO utility function or Array.reduce()
    // TODO User.credentials[providerId] check
    let matches: IMatch[] = [];
    for (const providerId of getProviderIds()) {
        const credentials = (user.credentials as any)[providerId];
        const providerMatches = await getProvider(providerId).getMatches(credentials);
        matches = matches.concat(providerMatches);
    }

    // right restriction
    return matches.filter((it) => sharedLink.matchIds.includes(it.id));
}

export async function getMessagesByMatch(sharedLinkLink: string, matchId: string): Promise<IMessage[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const {provider, id} = parseProviderId(matchId);
    return getProvider(provider).getMessagesByProfile((user.credentials as any)[provider], id);
}

export async function getUser(sharedLinkLink: string, matchId: string): Promise<IPerson> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const {provider, id} = parseProviderId(matchId);
    return getProvider(provider).getProfile((user.credentials as any)[provider], id);
}
