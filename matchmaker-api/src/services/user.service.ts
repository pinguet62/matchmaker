import {userRepositoryFactory} from "../database/repositories";
import {IMatch, IMessage, IPerson} from "../dto";
import {NotFoundException} from "../exceptions";
import {forEachProvider, parseProviderId} from "../providers/provider";
import {getProviderAction} from "../providers/providerAction";

export async function getMatchesByUserSharedLinkLink(sharedLinkLink: string): Promise<IMatch[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = await userRepositoryFactory().findSharedLinkBySharedLinkLink(sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    const matches: IMatch[] = await forEachProvider(
        user.credentials,
        (providerAction, credentials) => providerAction.getMatches(credentials),
    );

    // right restriction
    return matches.filter((it) => sharedLink.matchIds.includes(it.id));
}

export async function getMessagesByMatch(sharedLinkLink: string, providerMatchId: string): Promise<IMessage[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const {providerKey, id} = parseProviderId(providerMatchId);
    return getProviderAction(providerKey).getMessagesByProfile(user.credentials[providerKey]!, id);
}

export async function getUser(sharedLinkLink: string, providerUserId: string): Promise<IPerson> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const {providerKey, id} = parseProviderId(providerUserId);
    return getProviderAction(providerKey).getProfile(user.credentials[providerKey]!, id);
}
