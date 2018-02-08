import {resolve} from "url";
import {OnceCredentials} from "../../database/entities";
import {Match, Message, Person} from "../../dto";
import {IProvider} from "../provider";
import {getConnections, getMatch, getMessagesByMatch} from "./once-client";

export default class OnceProvider implements IProvider {
    public getMatches(credentials: OnceCredentials): Promise<Match[]> {
        return getConnections(credentials.authorization)
            .then((x) => {
                return x.connections.map((it) => {
                    return {
                        id: it.match_id,
                        lastMessage: it.last_message_id === 0 ? undefined : {
                            sent: credentials.userId === it.sender_id,
                            text: it.last_message,
                        },
                        person: {
                            name: it.user.first_name,
                            photo: resolve(x.base_url, it.user.pictures[0].original),
                        },
                    };
                });
            });
    }

    public getProfile(credentials: OnceCredentials, matchId: string): Promise<Person> {
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

    public getMessagesByProfile(credentials: OnceCredentials, profileId: string): Promise<Message[]> {
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
