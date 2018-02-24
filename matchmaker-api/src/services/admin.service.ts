import {SharedLink} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {IMatch, ISharedLink} from "../dto";
import {NotFoundException} from "../exceptions";
import {forEachProvider} from "../providers/provider";

export async function createEmptySharedLink(userId: string): Promise<ISharedLink> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = new SharedLink(Date.now().toString());
    user.sharedLinks.push(sharedLink);
    await userRepositoryFactory().save(user);

    return sharedLink;
}

export async function deleteSharedLink(userId: string, sharedLinkLink: string): Promise<ISharedLink> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const index = user.sharedLinks.findIndex((it: SharedLink) => it.link === sharedLinkLink);
    if (index === -1) {
        throw new NotFoundException();
    }

    const sharedLink = user.sharedLinks[index];

    user.sharedLinks.splice(index, 1);
    await userRepositoryFactory().save(user);

    return sharedLink;
}

export async function getMatchesByUser(userId: string): Promise<IMatch[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    return forEachProvider(
        user.credentials,
        (providerAction, credentials) => providerAction.getMatches(credentials),
    );
}

export async function getSharedLinks(userId: string): Promise<ISharedLink[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }
    return user.sharedLinks;
}

export async function updateSharedLinkMatches(userId: string, sharedLinkLink: string, matchIds: string[]): Promise<ISharedLink> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = user.sharedLinks.find((it: SharedLink) => it.link === sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    sharedLink.matchIds = matchIds;
    await userRepositoryFactory().save(user);

    return sharedLink;
}
