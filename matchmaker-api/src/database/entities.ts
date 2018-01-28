import {IsArray, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested} from "class-validator";
import {ObjectID} from "mongodb";
import {Column, Entity, ObjectIdColumn} from "typeorm";
import {IsInstance} from "../utils";

export class SharedLink {
    @Column()
    @IsDefined()
    public link: string;

    @Column()
    @IsNotEmpty({each: true})
    public matchIds: string[];

    constructor() {
        this.matchIds = [];
    }
}

@Entity()
export class User {
    @ObjectIdColumn()
    @IsOptional()
    @IsInstance(ObjectID) // @IsMongoId()
    public id: ObjectID;

    @Column()
    @IsDefined()
    public tinderUserId: string;

    @Column()
    @IsNotEmpty()
    public token: string;

    @Column((type: any) => SharedLink)
    @IsArray()
    @IsInstance(SharedLink, {each: true})
    @ValidateNested()
    public sharedLinks: SharedLink[];

    constructor() {
        this.sharedLinks = [];
    }
}

@Entity()
export class Proposition {
    @ObjectIdColumn()
    @IsOptional()
    @IsInstance(ObjectID) // @IsMongoId()
    public id: ObjectID;

    @Column()
    @IsDefined()
    public match: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    public message: string;

    @Column()
    @IsInt()
    @Min(0)
    public up: number = 0;

    @Column()
    @IsNotEmpty({each: true})
    public upVoters: string[];

    @Column()
    @IsInt()
    @Min(0)
    public down: number = 0;

    @Column()
    @IsNotEmpty({each: true})
    public downVoters: string[];

    constructor() {
        this.upVoters = [];
        this.downVoters = [];
    }
}
