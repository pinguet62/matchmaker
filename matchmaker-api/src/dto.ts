export interface ISharedLink {
    link: string;
    matchIds: string[];
}

export enum Status {
    NOT_REGISTERED = "not_registered",
    EXPIRED = "expired",
    UP_TO_DATE = "up_to_date",
}

export type CredentialStatus = ({ [provider: string]: Status });

export interface IMatch {
    id: string;
    lastMessage?: {
        sent: boolean;
        text: string;
    };
    person: {
        name: string,
        photo?: string;
    };
}

export interface IPerson {
    id: string;
    name: string;
    age: number;
    distance: number;
    description?: string;
    photos: string[];
    schools: string[];
    jobs: string[];
}

export interface IMessage {
    sent: boolean;
    received: boolean;
    date: Date;
    text: string;
}

export interface IProposition {
    id: string;
    message: string;
    up: number;
    down: number;
}
