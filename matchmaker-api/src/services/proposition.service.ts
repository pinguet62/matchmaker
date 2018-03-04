import {Proposition} from "../database/entities";
import {propositionRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import {IProviderId, ProviderIdstring} from "../providers/provider";

export async function createProposition(providerMatchId: ProviderIdstring, message: string): Promise<Proposition> {
    const entity = new Proposition(providerMatchId, message);
    return propositionRepositoryFactory().save(entity);
}

export async function decrementProposition(providerMatchId: ProviderIdstring, propositionId: string, voter: string): Promise<Proposition> {
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

    return propositionRepositoryFactory().save(proposition);
}

export async function deleteProposition(providerMatchId: ProviderIdstring, propositionId: string): Promise<Proposition> {
    const proposition = await propositionRepositoryFactory().findOneById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }

    return propositionRepositoryFactory().remove(proposition);
}

export async function getPropositions(providerMatchId: ProviderIdstring): Promise<Proposition[]> {
    return propositionRepositoryFactory().findByMatch(providerMatchId);
}

export async function incrementProposition(providerMatchId: ProviderIdstring, propositionId: string, voter: string): Promise<Proposition> {
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

    return propositionRepositoryFactory().save(proposition);
}
