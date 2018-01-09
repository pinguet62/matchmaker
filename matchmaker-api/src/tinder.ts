import * as request from "request-promise";

export interface IMatchDto {
    _id: string;
    person: IUserDto;
}

export interface IUserDto {
    _id: string;
    name: string;
    photos: IPhoto[];
}

export interface IPhoto {
    id: string;
    url: string;
}

export interface IMessage {
    _id: string;
    from: string;
    to: string;
    message: string;
    sent_date: string;
}

export async function getUser(token: string, userId: string): Promise<IUserDto> {
    return await request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/user/${userId}`,
    }).then((x) => x.results);
}

export async function getMatches(token: string): Promise<IMatchDto[]> {
    return request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: "https://api.gotinder.com/v2/matches",
    }).then((x) => x.data.matches);
}

export async function getMessagesByMatch(token: string, matchId: string): Promise<IMessage[]> {
    return await request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/v2/matches/${matchId}/messages`,
    }).then((x) => x.data.messages);
}