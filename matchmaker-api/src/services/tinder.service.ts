import {User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {Match, Message, Person} from "../dto";
import {NotFoundException} from "../exceptions";
import {getProvider} from "../providers/provider";

export async function getMatchesByUser(userId: string): Promise<Match[]> {
    const user: User = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    return getProvider("tinder").getMatches(user.credentials.tinder);
}

export async function getMatchesByUserSharedLinkLink(sharedLinkLink: string): Promise<Match[]> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = await userRepositoryFactory().findSharedLinkBySharedLinkLink(sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    const matches = await getProvider("tinder").getMatches(user.credentials.tinder);
    return matches.filter((it) => sharedLink.matchIds.includes(it.id)); // right restriction
}

export async function getUser(sharedLinkLink: string, tinderUserOrMatchId: string): Promise<Person> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderUserId = tinderUserOrMatchId.length === 48 ? tinderUserOrMatchId.substr(24, 24) : tinderUserOrMatchId; // TODO polish

    return getProvider("tinder").getProfile(user.credentials.tinder, tinderUserId);
}

export async function getMessagesByMatch(sharedLinkLink: string, matchId: string): Promise<Message[]> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    return getProvider("tinder").getMessagesByProfile(user.credentials.tinder, matchId);
}
