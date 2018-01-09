import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public token: string;

    @Column((type: any) => SharedLink)
    public sharedLinks: SharedLink[] = [];
}

export class SharedLink {
    @Column()
    public link: string;

    @Column()
    public matchIds: string[] = [];
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
    public down: number = 0;
}
