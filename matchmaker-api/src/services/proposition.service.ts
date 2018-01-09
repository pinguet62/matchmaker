import {Proposition} from "../database/entities";
import {propositionRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";

export async function createProposition(matchId: string, proposition: Proposition): Promise<Proposition> {
    proposition.match = matchId;

    return propositionRepositoryFactory().save(proposition);
}

export async function getPropositions(matchId: string): Promise<Proposition[]> {
    return propositionRepositoryFactory().findByMatch(matchId);
}

export async function incrementProposition(matchId: string, propositionId: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    proposition.up = (proposition.up || 0) + 1;
    await propositionRepositoryFactory().save(proposition);

    return proposition;
}

export async function decrementProposition(matchId: string, propositionId: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    proposition.down = (proposition.down || 0) - 1;
    await propositionRepositoryFactory().save(proposition);

    return proposition;
}

export async function deleteProposition(matchId: string, propositionId: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    await propositionRepositoryFactory().remove(proposition);

    return proposition;
}
