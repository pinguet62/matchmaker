import {OnceCredentials} from "../../database/entities";
import {IMatch, IMessage, IPerson} from "../../dto";
import {formatProviderId} from "../provider";
import {IProviderAction} from "../providerAction";
import {getConnections, getMatch, getMe, getMessagesByMatch, IPictureDto, IUserDto} from "./once-client";

function formatPhotoUrl(baseUrl: string, user: IUserDto, picture: IPictureDto): string {
    return baseUrl + "/" + user.id + "/" + picture.original;
}

export default class OnceProviderAction implements IProviderAction {
    public getUserId(secret: string): Promise<string> {
        return getMe(secret).then((x) => x.id);
    }

    public getMatches(credentials: OnceCredentials): Promise<IMatch[]> {
        return getConnections(credentials.authorization)
            .then((x) => {
                return x.connections.map((it) => {
                    return {
                        id: formatProviderId({providerKey: "once", id: it.match_id}),
                        lastMessage: it.last_message_id === 0 ? undefined : {
                            sent: credentials.userId === it.sender_id,
                            text: it.last_message,
                        },
                        person: {
                            name: it.user.first_name,
                            photo: formatPhotoUrl(x.base_url, it.user, it.user.pictures[0]),
                        },
                    };
                });
            });
    }

    public getProfile(credentials: OnceCredentials, matchId: string): Promise<IPerson> {
        return getMatch(credentials.authorization, matchId)
            .then((x) => {
                return {
                    age: x.match.user.age,
                    description: x.match.user.description,
                    distance: x.match.commons.distance.km,
                    id: x.match.id,
                    jobs: x.match.user.occupation.position ? [x.match.user.occupation.position] : [],
                    name: x.match.user.first_name,
                    photos: x.match.user.pictures.map((it) => formatPhotoUrl(x.base_url, x.match.user, it)),
                    schools: x.match.user.education.map((it) => it.school_name + " - " + it.school_type),
                };
            });
    }

    public getMessagesByProfile(credentials: OnceCredentials, profileId: string): Promise<IMessage[]> {
        return getMessagesByMatch(credentials.authorization, profileId)
            .then((x) => x.map((it) => {
                    return {
                        date: new Date(it.created_at),
                        received: credentials.userId !== it.sender_id,
                        sent: credentials.userId === it.sender_id,
                        text: it.message,
                    };
                }),
            );
    }
}
