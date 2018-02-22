import {OnceCredentials} from "../../database/entities";
import {IMatch, IMessage, IPerson} from "../../dto";
import {IProvider} from "../provider";
import {formatProviderId} from "../providerUtils";
import {getConnections, getMatch, getMe, getMessagesByMatch} from "./once-client";

export default class OnceProvider implements IProvider {
    public getUserId(secret: string): Promise<string> {
        return getMe(secret).then((x) => x.id);
    }

    public getMatches(credentials: OnceCredentials): Promise<IMatch[]> {
        return getConnections(credentials.authorization)
            .then((x) => {
                return x.connections.map((it) => {
                    return {
                        id: formatProviderId({provider: "once", id: it.match_id}),
                        lastMessage: it.last_message_id === 0 ? undefined : {
                            sent: credentials.userId === it.sender_id,
                            text: it.last_message,
                        },
                        person: {
                            name: it.user.first_name,
                            photo: x.base_url + "/" + it.match_id + "/" + it.user.pictures[0].original,
                        },
                    };
                });
            });
    }

    public getProfile(credentials: OnceCredentials, matchId: string): Promise<IPerson> {
        return getMatch(credentials.authorization, matchId)
            .then((it) => {
                return {
                    age: it.user.age,
                    description: it.user.description,
                    distance: it.commons.distance.km,
                    id: it.id,
                    jobs: it.user.occupation.position ? [it.user.occupation.position] : [],
                    name: it.user.first_name,
                    photos: it.user.pictures.map((x) => x.original),
                    schools: it.user.pictures.map((x) => x.original),
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
