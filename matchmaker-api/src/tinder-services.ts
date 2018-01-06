import * as request from "request-promise";

const token = process.env.TINDER_TOKEN;

interface IPhoto {
    id: string;
    url: string;
}

interface IUserDto {
    _id: string;
    name: string;
    photos: IPhoto[];
}

export async function getUser(userOrMatchId: string): Promise<IUserDto> {
    const userId = userOrMatchId.length === 48 ? userOrMatchId.substr(24, 24) : userOrMatchId;
    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": token,
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

export async function getMatches(): Promise<IMatchDto[]> {
    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: "https://api.gotinder.com/v2/matches",
    });
    return tinderResponse.data.matches;
}

interface IMessage {
    _id: string;
    from: string;
    to: string;
    message: string;
    sent_date: string;
}

export async function getMessagesByMatch(matchId: string): Promise<IMessage[]> {
    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/v2/matches/${matchId}/messages`,
    });
    return tinderResponse.data.messages;
}
