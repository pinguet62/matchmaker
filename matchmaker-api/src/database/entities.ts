import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public tinderUserId: string;

    @Column()
    public token: string;

    @Column((type: any) => SharedLink)
    public sharedLinks: SharedLink[];

    constructor() {
        this.sharedLinks = [];
    }
}

export class SharedLink {
    @Column()
    public link: string;

    @Column()
    public matchIds: string[];

    constructor() {
        this.matchIds = [];
    }
}

@Entity()
export class Proposition {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public match: string;

    @Column()
    public message: string;

    @Column()
    public up: number = 0;

    @Column()
    public upVoters: string[];

    @Column()
    public down: number = 0;

    @Column()
    public downVoters: string[];

    constructor() {
        this.upVoters = [];
        this.downVoters = [];
    }
}
