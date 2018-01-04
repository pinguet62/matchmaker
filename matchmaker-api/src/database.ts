export interface IProposition {
    _id: string;
    match: string;
    message: string;
    up?: number;
    down?: number;
}

// mock database
const propositions: IProposition[] = [];
// fill examples
propositions.push(
    {_id: "1", match: "111", message: "Bonjour, moi c'est Julien.", up: 1, down: 5},
    {_id: "2", match: "222", message: "Très jolie !", up: 11, down: 2},
    {_id: "3", match: "333", message: "Que fais-tu dans la vie ?", up: 5, down: 9},
);

export async function getById(id: string): Promise<IProposition | null> {
    const found = propositions.filter((p) => p._id === id)
    return found.length === 0 ? null : found[0];
}

export async function getByMatch(match: string): Promise<IProposition[]> {
    return propositions.filter((p) => p.match === match);
}

export async function insert(proposition: IProposition): Promise<IProposition> {
    propositions.push(proposition);
    return proposition;
}
