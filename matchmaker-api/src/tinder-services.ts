import * as request from "request-promise";

const token = process.env.TINDER_TOKEN;

interface IMatchDto {
    _id: string;
    person: {
        _id: string;
        name: string;
        photos: Array<{
            id: string;
            url: string;
        }>;
    };
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

export async function getMessages(matchId: string): Promise<IMessage[]> {
    const tinderResponse: any = await request({
        headers: {
            "x-auth-token": token,
        },
        json: true,
        method: "GET",
        url: `https://api.gotinder.com/v2/matches/${matchId}/messages`,
    });
    return tinderResponse.data.matches;
}
