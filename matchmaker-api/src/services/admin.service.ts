import {SharedLink} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {Match} from "../dto";
import {NotFoundException} from "../exceptions";
import {getProvider} from "../providers/provider";

export async function createEmptySharedLink(userId: string): Promise<SharedLink> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = new SharedLink();
    sharedLink.link = Date.now().toString();

    user.sharedLinks.push(sharedLink);
    await userRepositoryFactory().save(user);

    return sharedLink;
}

export async function deleteSharedLink(userId: string, sharedLinkLink: string): Promise<SharedLink> {
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

export async function getMatchesByUser(userId: string): Promise<Match[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    return getProvider("tinder").getMatches(user.credentials.tinder);
}

export async function getSharedLinks(userId: string): Promise<SharedLink[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }
    return user.sharedLinks;
}

export async function updateSharedLinkMatches(userId: string, sharedLinkLink: string, matchIds: string[]): Promise<SharedLink> {
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