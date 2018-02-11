import {OnceCredentials, TinderCredentials, User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {NotFoundException} from "../exceptions";
import {getMe} from "../providers/once/once-client";
import {UnsupportedProviderError} from "../providers/provider";
import {getMeta} from "../providers/tinder/tinder-client";

/**
 * @param tinderToken {@link User#token}
 * @return {Promise<string>} {@link User#id}
 */
export async function login(provider: string, tinderToken: string): Promise<string> {
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

export async function registerCredentials(userId: string, provider: string, secret: any) {
    switch (provider) { // TODO Factory interface
        case "tinder":
            return registerTinderCredentials(userId, secret);
        case "once":
            return registerOnceCredentials(userId, secret);
        default:
            throw new UnsupportedProviderError(provider);
    }
}

/** Initialize {@link Credentials#tinder}. */
export async function registerTinderCredentials(userId: string, tinderToken: string) {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    if (!user.credentials.tinder) {
        user.credentials.tinder = new TinderCredentials();
        user.credentials.tinder.userId = await getMeta(tinderToken).then((x) => x.user._id);
    }
    user.credentials.tinder.token = tinderToken;

    userRepositoryFactory().save(user);
}

/** Initialize {@link Credentials#once}. */
export async function registerOnceCredentials(userId: string, onceAuthorization: string) {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    if (!user.credentials.once) {
        user.credentials.once = new OnceCredentials();
        user.credentials.once.userId = await getMe(onceAuthorization).then((x) => x.id);
    }
    user.credentials.once.authorization = onceAuthorization;

    userRepositoryFactory().save(user);
}

export enum Status {
    NOT_REGISTERED = "not_registered",
    EXPIRED = "expired",
    UP_TO_DATE = "up_to_date",
}

type CredentialStatus = ({ [provider: string]: Status });

export async function checkCredentials(userId: string): Promise<CredentialStatus> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const providers: CredentialStatus = {};
    if (user.credentials.tinder) {
        providers.tinder = await getMeta(user.credentials.tinder.token).then((x) => Status.UP_TO_DATE).catch((x) => Status.EXPIRED);
    } else {
        providers.tinder = Status.NOT_REGISTERED;
    }
    if (user.credentials.once) {
        providers.once = await getMe(user.credentials.once.authorization).then((x) => Status.UP_TO_DATE).catch((x) => Status.EXPIRED);
    } else {
        providers.once = Status.NOT_REGISTERED;
    }

    return providers;
}
