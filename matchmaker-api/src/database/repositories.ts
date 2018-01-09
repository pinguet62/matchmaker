import {EntityRepository, getCustomRepository, getMongoRepository} from "typeorm";
import {MongoRepository} from "typeorm/repository/MongoRepository";
import {Proposition, SharedLink, User} from "./entities";

export const userRepositoryFactory: () => UserRepository & MongoRepository<User> =
    () => getCustomRepository(UserRepository);

export const propositionRepositoryFactory: () => PropositionRepository & MongoRepository<Proposition> =
    () => getCustomRepository(PropositionRepository);

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {

    /**
     * @param token {@link User#token}
     */
    public findOneByToken(token: string): Promise<User | undefined> {
        return super.findOne({token});
    }

    /**
     * {@link SharedLink#link} is unique, so {@link SharedLink} and {@link User} too.
     * @param sharedLinkLink {@link User#sharedLinks} > {@link SharedLink#link}
     */
    public async findOneBySharedLinkLink(sharedLinkLink: string): Promise<User | undefined> {
        // TODO query
        for (const user of await super.find()) {
            for (const sharedLink of user.sharedLinks) {
                if (sharedLink.link === sharedLinkLink) {
                    return user;
                }
            }
        }
        return undefined;
    }

    /**
     * {@link SharedLink#link} is unique, so {@link SharedLink} and {@link User} too.
     * @param sharedLinkLink {@link User#sharedLinks} > {@link SharedLink#link}
     */
    public async findSharedLinkBySharedLinkLink(sharedLinkLink: string): Promise<SharedLink | undefined> {
        // TODO query
        for (const user of await super.find()) {
            for (const sharedLink of user.sharedLinks) {
                if (sharedLink.link === sharedLinkLink) {
                    return sharedLink;
                }
            }
        }
        return undefined;
    }

}

@EntityRepository(Proposition)
export class PropositionRepository extends MongoRepository<Proposition> {

    /**
     * @param token {@link Proposition#match}
     */
    public findByMatch(match: string): Promise<Proposition[]> {
        return super.find({match});
    }

}