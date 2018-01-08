export interface IUser {
    id?: string;
    token: string;
    sharedLinks: ISharedLink[];
}

export interface ISharedLink {
    link: string;
    matchIds: string[];
}

// mock database
const users: IUser[] = [];

export async function save(user: IUser): Promise<IUser> {
    user.id = Date.now().toString()
    users.push(user);
    return user;
}

export async function getById(id: string): Promise<IUser | null> {
    const found = users.filter((it) => it.id === id);
    return found.length === 0 ? null : found[0];
}

export async function getByToken(token: string): Promise<IUser | null> {
    const found = users.filter((it) => it.token === token);
    return found.length === 0 ? null : found[0];
}

export async function getBySharedLinkLink(sharedLinkLink: string): Promise<IUser | null> {
    for (const user of users) {
        for (const sharedLink of user.sharedLinks) {
            if (sharedLink.link === sharedLinkLink) {
                return user;
            }
        }
    }
    return null;
}

export async function getMatchIdsBySharedLinkLink(sharedLinkLink: string): Promise<string[] | null> {
    for (const user of users) {
        for (const sharedLink of user.sharedLinks) {
            if (sharedLink.link === sharedLinkLink) {
                return sharedLink.matchIds;
            }
        }
    }
    return null;
}
