import { get } from "request-promise";

export interface IConnectionResults {
    connections: IConnectionDto[];
    base_url: string; // for `connections.*.pictures.*.original`
}

export interface IConnectionDto {
    user: IUserDto;
    match_id: string; // "MEAxxxxxxxxx"
    sender_id: string; // IUser.id
    last_message: string; // default: "Vous avez été connectés"
    last_message_id: number; // default: 0
    message_sent_at: number;
}

export interface IUserDto {
    id: string; // "EAxxxxxx"
    first_name: string;
    age: number;
    description?: string;
    pictures: IPictureDto[];
    occupation: {
        employer: string | null,
        position: string | null,
    };
    education: Array<{
        school_type: string,
        school_name: string,
    }>;
}

export interface IPictureDto {
    id: string;
    original: string; // `${id}_original.jpg`
}

export interface IMessage {
    id: string; // `${matchId}::${number}`
    number: number;
    sender_id: string;
    message: string;
    created_at: number;
}

export interface IMatchResults {
    match: IMatchDto;
    base_url: string; // for `match.user.pictures.*.original`
}

export interface IMatchDto {
    id: string;
    number: number;
    user: IUserDto;
    commons: {
        distance: { km: number },
    };
}

export async function getMatch(authorization: string, matchId: string): Promise<IMatchResults> {
    return await get({
        headers: {
            authorization,
        },
        json: true,
        url: `https://onceapi.com/v1/match/${matchId}`,
    }).then((x: any) => x.result);
}

export async function getConnections(authorization: string): Promise<IConnectionResults> {
    return get({
        headers: {
            authorization,
        },
        json: true,
        url: "https://onceapi.com/v1/connections",
    }).then((x: any) => x.result);
}

export async function getMessagesByMatch(authorization: string, matchId: string): Promise<IMessage[]> {
    return await get({
        headers: {
            authorization,
        },
        json: true,
        url: `https://onceapi.com/v1/messages?match_id=${matchId}`,
    }).then((x: any) => x.result.messages);
}

export async function getMe(authorization: string): Promise<IUserDto> {
    return await get({
        headers: {
            authorization,
        },
        json: true,
        url: `https://onceapi.com/v1/user/me`,
    }).then((x: any) => x.result.user);
}
