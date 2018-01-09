import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import * as tinder from "../tinder";
import {IMatchDto, IMessage, IUserDto} from "../tinder";

export async function getUser(sharedLinkLink: string, tinderUserOrMatchId: string): Promise<IUserDto> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderUserId = tinderUserOrMatchId.length === 48 ? tinderUserOrMatchId.substr(24, 24) : tinderUserOrMatchId;

    return tinder.getUser(user.token, tinderUserId);
}

export async function getMatchesByUser(userId: string): Promise<IMatchDto[]> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    return tinder.getMatches(user.token);
}

export async function getMatchesByUserSharedLinkLink(sharedLinkLink: string): Promise<IMatchDto[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = await userRepositoryFactory().findSharedLinkBySharedLinkLink(sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    const matches = await tinder.getMatches(user.token);
    return matches.filter((it: IMatchDto) => sharedLink.matchIds.includes(it._id)); // right restriction
}

export async function getMessagesByMatch(sharedLinkLink: string, matchId: string): Promise<IMessage[]> {
    const user = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    return tinder.getMessagesByMatch(user.token, matchId);
}
