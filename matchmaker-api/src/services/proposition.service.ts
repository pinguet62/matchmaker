import {Proposition} from "../database/entities";
import {propositionRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";

export async function createProposition(matchId: string, proposition: Proposition): Promise<Proposition> {
    const entity = new Proposition();
    entity.match = matchId;
    entity.message = proposition.message;

    return propositionRepositoryFactory().save(entity);
}

export async function getPropositions(matchId: string): Promise<Proposition[]> {
    return propositionRepositoryFactory().findByMatch(matchId);
}

export async function incrementProposition(matchId: string, propositionId: string, voter: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    const upIndex = proposition.upVoters.indexOf(voter);
    const downIndex = proposition.downVoters.indexOf(voter);
    if (upIndex !== -1) { // revert vote
        proposition.upVoters.splice(upIndex, 1);
        proposition.up = proposition.up - 1;
    } else if (downIndex !== -1) { // change vote
        proposition.downVoters.splice(downIndex, 1);
        proposition.down = proposition.down - 1;
        proposition.upVoters.push(voter);
        proposition.up = proposition.up + 1;
    } else {
        proposition.upVoters.push(voter);
        proposition.up = proposition.up + 1;
    }

    await propositionRepositoryFactory().save(proposition);

    return proposition;
}

export async function decrementProposition(matchId: string, propositionId: string, voter: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    const upIndex = proposition.upVoters.indexOf(voter);
    const downIndex = proposition.downVoters.indexOf(voter);
    if (downIndex !== -1) { // revert vote
        proposition.downVoters.splice(downIndex, 1);
        proposition.down = proposition.down - 1;
    } else if (upIndex !== -1) { // change vote
        proposition.upVoters.splice(upIndex, 1);
        proposition.up = proposition.up - 1;
        proposition.downVoters.push(voter);
        proposition.down = proposition.down + 1;
    } else {
        proposition.downVoters.push(voter);
        proposition.down = proposition.down + 1;
    }

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
