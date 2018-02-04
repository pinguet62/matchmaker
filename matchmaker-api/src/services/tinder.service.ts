import {User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import * as tinder from "../tinder";
import {IJobDto, IMatchDto} from "../tinder";
import {Match, Message, Person} from "./dto";

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

export async function getUser(sharedLinkLink: string, tinderUserOrMatchId: string): Promise<Person> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const tinderUserId = tinderUserOrMatchId.length === 48 ? tinderUserOrMatchId.substr(24, 24) : tinderUserOrMatchId;

    return tinder.getUser(user.credentials.tinder.token, tinderUserId)
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

export async function getMatchesByUser(userId: string): Promise<IMatchDto[]> {
    const user: User = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    return tinder.getMatches(user.credentials.tinder.token);
}

export async function getMatchesByUserSharedLinkLink(sharedLinkLink: string): Promise<Match[]> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    const sharedLink = await userRepositoryFactory().findSharedLinkBySharedLinkLink(sharedLinkLink);
    if (!sharedLink) {
        throw new NotFoundException();
    }

    const matches = await tinder.getMatches(user.credentials.tinder.token);
    return matches.filter((it) => sharedLink.matchIds.includes(it._id)) // right restriction
        .map((it) => {
            return {
                id: it._id,
                lastMessage: it.messages.length === 0 ? undefined : {
                    sent: user.credentials.tinder.userId === it.messages[0].from,
                    text: it.messages[0].message,
                },
                person: {
                    name: it.person.name,
                    photo: it.person.photos[0].url,
                },
            };
        });
}

export async function getMessagesByMatch(sharedLinkLink: string, matchId: string): Promise<Message[]> {
    const user: User = await userRepositoryFactory().findOneBySharedLinkLink(sharedLinkLink);
    if (!user) {
        throw new NotFoundException();
    }

    return tinder.getMessagesByMatch(user.credentials.tinder.token, matchId)
        .then((x) => x.map((it) => {
                return {
                    date: new Date(it.sent_date),
                    received: user.credentials.tinder.userId !== it.from,
                    sent: user.credentials.tinder.userId === it.from,
                    text: it.message,
                };
            }),
        );
}
