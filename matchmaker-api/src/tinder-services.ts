import * as request from "request-promise";
import {NotFoundException} from "./exceptions";
import {getById, getBySharedLinkLink, getMatchIdsBySharedLinkLink} from "./user-database";

interface IPhoto {
    id: string;
    url: string;
}

interface IUserDto {
    _id: string;
    name: string;
    photos: IPhoto[];
}

export async function getUser(sharedLinkLink: string, userOrMatchId: string): Promise<IUserDto> {
    const user = await getBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const userId = userOrMatchId.length === 48 ? userOrMatchId.substr(24, 24) : userOrMatchId;
    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": user.token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/user/${userId}`,
    });
    return tinderResponse.results;
}

interface IMatchDto {
    _id: string;
    person: IUserDto;
}

export async function getMatchesByUser(userId: string): Promise<IMatchDto[]> {
    const user = await getById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": user.token,
        },
        json: true,
        method: "GET",
        url: "https://api.gotinder.com/v2/matches",
    });
    return tinderResponse.data.matches;
}

export async function getMatches(sharedLinkLink: string): Promise<IMatchDto[]> {
    const user = await getBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": user.token,
        },
        json: true,
        method: "GET",
        url: "https://api.gotinder.com/v2/matches",
    });

    const matchIds = await getMatchIdsBySharedLinkLink(sharedLinkLink);
    if (!matchIds) {
        throw new Error();
    }
    return tinderResponse.data.matches.filter((it: IMatchDto) => matchIds.includes(it._id));
}

interface IMessage {
    _id: string;
    from: string;
    to: string;
    message: string;
    sent_date: string;
}

export async function getMessagesByMatch(sharedLinkLink: string, matchId: string): Promise<IMessage[]> {
    const user = await getBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": user.token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/v2/matches/${matchId}/messages`,
    });
    return tinderResponse.data.messages;
}
