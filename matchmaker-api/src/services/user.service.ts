import {SharedLink, User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";

/**
 * @param token {@link User#token}
 * @return {Promise<string>} {@link User#id}
 */
export async function login(token: string): Promise<string> {
    let user = await userRepositoryFactory().findOneByToken(token);

    // create account if not exists
    if (!user) {
        user = new User()
        user.token = token;
        await userRepositoryFactory().save(user);
    }

    return user.id;
}

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

export async function getSharedLinks(userId: string): Promise<SharedLink[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }
    return user.sharedLinks;
}

export async function updateSharedLinkMatchs(userId: string, sharedLinkLink: string, matchIds: string[]): Promise<SharedLink> {
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
