import {deleteById, getById, getByMatch, IProposition, save} from "./database";
import {NotFoundException} from "./exceptions";

export async function createProposition(matchId: string, proposition: IProposition): Promise<IProposition> {
    proposition.match = matchId;
    return save(proposition);
}

export async function getPropositions(matchId: string): Promise<IProposition[]> {
    return getByMatch(matchId);
}

export async function incrementProposition(matchId: string, propositionId: string): Promise<IProposition> {
    const proposition = await getById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }
    proposition.up = (proposition.up || 0) + 1;
    return Promise.resolve(proposition);
}

export async function decrementProposition(matchId: string, propositionId: string): Promise<IProposition> {
    const proposition = await getById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }
    proposition.down = (proposition.down || 0) - 1;
    return Promise.resolve(proposition);
}

export async function deleteProposition(matchId: string, propositionId: string): Promise<IProposition> {
    const proposition = await deleteById(propositionId);
    if (!proposition) {
        throw new NotFoundException();
    }
    return proposition;
}
