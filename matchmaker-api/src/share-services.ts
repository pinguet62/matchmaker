import {NotFoundException} from "./exceptions";

interface IUser {
    id: string;
    token: string;
    sharedLinks: ISharedLink[];
}

interface ISharedLink {
    link: string;
    matchIds: string[];
}

// mock database
const users: IUser[] = [];

export async function login(token: string): Promise<string> {
    let user = users.find((it) => it.token === token);

    if (!user) {
        user = {
            id: Date.now().toString(),
            sharedLinks: [],
            token,
        };
        users.push(user);
    }

    return user.id;
}

export async function createSharedLink(userId: string): Promise<ISharedLink> {
    const user = users.find((it) => it.id === userId);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink: ISharedLink = {
        link: Date.now().toString(),
        matchIds: [],
    };
    user.sharedLinks.push(sharedLink);

    return Promise.resolve(sharedLink);
}

export async function getSharedLinks(userId: string): Promise<ISharedLink[]> {
    const user = users.find((it) => it.id === userId);
    if (!user) {
        throw new NotFoundException();
    }
    return Promise.resolve(user.sharedLinks);
}

export async function updateSharedLinkLinks(userId: string, sharedLinkLink: string, matchIds: string[]): Promise<ISharedLink> {
    const user = users.find((it) => it.id === userId);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = user.sharedLinks.find((it) => it.link === sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    sharedLink.matchIds = matchIds;

    return Promise.resolve(sharedLink);
}

export async function deleteSharedLink(userId: string, sharedLinkLink: string): Promise<ISharedLink> {
    const user = users.find((it) => it.id === userId);
    if (!user) {
        throw new NotFoundException();
    }

    const index = user.sharedLinks.findIndex((it) => it.link === sharedLinkLink);
    if (index === -1) {
        throw new NotFoundException();
    }

    const sharedLink = user.sharedLinks[index];
    user.sharedLinks.splice(index, 1);

    return Promise.resolve(sharedLink);
}
