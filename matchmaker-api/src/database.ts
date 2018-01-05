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
    {_id: "1", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Bonjour, moi c'est Julien.", up: 1, down: 5},
    {_id: "2", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Très jolie !", up: 11, down: 2},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Que fais-tu dans la vie ?", up: 5, down: 9},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Alors le père Noël a été généreux ?", up: 5, down: 9},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Que cherches-tu ?", up: 5, down: 9},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Tu veux boire un verre ?", up: 5, down: 9},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15a4a029456899e2525a5bf00", message: "Pardon c'est une erreur...", up: 5, down: 9},
    {_id: "3", match: "52b4d9ed6c5685412c0002a15585a9f97a2f3cd62addbeda", message: "Je fais le 1er pas...", up: 5, down: 9},
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
