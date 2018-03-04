import { get } from "request-promise";

export interface IMatchDto {
    _id: string;
    messages: IMessage[];
    person: IUserDto;
}

export interface IJobDto {
    company?: { name: string };
    title?: { name: string };
}

export interface IUserDto {
    _id: string;
    bio?: string;
    birth_date: string; // 1989-xx-xxTxx:xx:xx.xxxZ
    name: string;
    photos: IPhoto[]; // TODO check if default is []
    jobs: IJobDto[];
    schools: Array<{ id: string, name: string }>;
    distance_mi: number;
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

export interface IMetaDto {
    user: IUserDto;
}

export async function getMeta(token: string): Promise<IMetaDto> {
    return get({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        url: `https://api.gotinder.com/meta`,
    });
}

export async function getUser(token: string, userId: string): Promise<IUserDto> {
    return await get({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        url: `https://api.gotinder.com/user/${userId}`,
    }).then((x: any) => x.results);
}

export async function getMatches(token: string): Promise<IMatchDto[]> {
    return get({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        url: "https://api.gotinder.com/v2/matches",
    }).then((x: any) => x.data.matches);
}

export async function getMessagesByMatch(token: string, matchId: string): Promise<IMessage[]> {
    return await get({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        url: `https://api.gotinder.com/v2/matches/${matchId}/messages?count=100`,
    }).then((x: any) => x.data.messages);
}
