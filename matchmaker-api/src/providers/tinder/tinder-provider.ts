import {TinderCredentials} from "../../database/entities";
import {Match, Message, Person} from "../../dto";
import {IProvider} from "../provider";
import * as tinderClient from "./tinder-client";
import {IJobDto} from "./tinder-client";

export function formatJob(job: IJobDto): string {
    if (job.title && job.company) {
        return `${job.title.name} chez ${job.company.name}`; // TODO i18n
    } else if (job.title) {
        return job.title.name;
    } else if (job.company) {
        return job.company.name;
    } else {
        throw new Error("Unknown IJobDto format");
    }
}

export function calculateAge(birthDate: string) {
    return new Date(Date.now()).getFullYear() - parseInt(birthDate.substr(0, 4), 10) - 1;
}

export default class TinderProvider implements IProvider {
    public getMatches(credentials: TinderCredentials): Promise<Match[]> {
        return tinderClient.getMatches(credentials.token)
            .then((x) => x.map((it) => {
                return {
                    id: it._id,
                    lastMessage: it.messages.length === 0 ? undefined : {
                        sent: credentials.userId === it.messages[0].from,
                        text: it.messages[0].message,
                    },
                    person: {
                        name: it.person.name,
                        photo: it.person.photos[0].url,
                    },
                };
            }));
    }

    public getProfile(credentials: TinderCredentials, tinderUserId: string): Promise<Person> {
        return tinderClient.getUser(credentials.token, tinderUserId)
            .then((it) => {
                return {
                    age: calculateAge(it.birth_date),
                    description: it.bio,
                    distance: it.distance_mi,
                    id: it._id,
                    jobs: it.jobs.map(formatJob),
                    name: it.name,
                    photos: it.photos.map((x) => x.url),
                    schools: it.schools.map((x) => x.name),
                };
            });
    }

    public getMessagesByProfile(credentials: TinderCredentials, matchId: string): Promise<Message[]> {
        return tinderClient.getMessagesByMatch(credentials.token, matchId)
            .then((x) => x.map((it) => {
                    return {
                        date: new Date(it.sent_date),
                        received: credentials.userId !== it.from,
                        sent: credentials.userId === it.from,
                        text: it.message,
                    };
                }),
            );
    }
}
