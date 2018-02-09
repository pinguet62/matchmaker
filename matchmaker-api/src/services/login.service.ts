import {TinderCredentials, User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {getMeta} from "../providers/tinder/tinder-client";

/**
 * @param tinderToken {@link User#token}
 * @return {Promise<string>} {@link User#id}
 */
export async function login(tinderToken: string): Promise<string> {
    const tinderUserId = await getMeta(tinderToken).then((x) => x.user._id);

    let user = await userRepositoryFactory().findOneByCredentialsTinderUserId(tinderUserId);
    // create account if not exists
    if (!user) {
        user = new User();
        user.credentials.tinder = new TinderCredentials();
        user.credentials.tinder.userId = tinderUserId;
    }
    // refresh token
    user.credentials.tinder!.token = tinderToken;

    await userRepositoryFactory().save(user);

    return user.id.toHexString();
}
