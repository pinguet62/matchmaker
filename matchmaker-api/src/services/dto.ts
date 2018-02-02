export interface Message {
    sent: boolean;
    received: boolean;
    date: Date;
    text: string;
}

export interface Person {
    id: string;
    name: string;
    age: number;
    distance: number;
    description?: string;
    photos: string[];
    schools: string[];
    jobs: string[];
}

export interface Match {
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
