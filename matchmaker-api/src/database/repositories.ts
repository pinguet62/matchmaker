import {EntityRepository, getCustomRepository} from "typeorm";
import {MongoRepository} from "typeorm/repository/MongoRepository";
import {ProviderKey} from "../providers/provider";
import {Proposition, SharedLink, User} from "./entities";

export const userRepositoryFactory: () => UserRepository & MongoRepository<User> =
    () => getCustomRepository(UserRepository);

export const propositionRepositoryFactory: () => PropositionRepository & MongoRepository<Proposition> =
    () => getCustomRepository(PropositionRepository);

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {

    /**
     * @param tinderUserId {@link User#tinderUserId}
     */
    public async findOneByCredentialUserId(providerKey: ProviderKey, providerUserId: string): Promise<User | undefined> {
        // TODO query
        for (const user of await super.find()) {
            if (user.credentials[providerKey] && user.credentials[providerKey]!.userId === providerUserId) {
                return user;
            }
        }
        return undefined;
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
