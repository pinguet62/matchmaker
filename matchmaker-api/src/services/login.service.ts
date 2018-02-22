import {OnceCredentials, TinderCredentials, User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {CredentialStatus, Status} from "../dto";
import {NotFoundException} from "../exceptions";
import {getMe} from "../providers/once/once-client";
import {getProvider, getProviderIds, UnsupportedProviderError} from "../providers/provider";
import {getMeta} from "../providers/tinder/tinder-client";

/**
 * @param tinderToken {@link User#token}
 * @return {Promise<string>} {@link User#id}
 */
export async function login(provider: string, secret: string): Promise<string> {
    const providerUserId = await getProvider(provider).getUserId(secret);

    let user = await userRepositoryFactory().findOneByCredentialUserId(provider, providerUserId);

    // create account if not exists
    if (!user) {
        user = new User();
        switch (provider) {
            case "tinder":
                user.credentials.tinder = new TinderCredentials(providerUserId, secret);
                break;
            case "once":
                user.credentials.once = new OnceCredentials(providerUserId, secret);
                break;
            default:
                throw new UnsupportedProviderError(`Unknown provider ${provider}`);
        }
    }

    // refresh token
    switch (provider) {
        case "tinder":
            user.credentials.tinder!.token = secret;
            break;
        case "once":
            user.credentials.once!.authorization = secret;
            break;
        default:
            throw new UnsupportedProviderError(`Unknown provider ${provider}`);
    }

    await userRepositoryFactory().save(user);

    return user.id!.toHexString();
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
        const tinderUserId = await getMeta(tinderToken).then((x) => x.user._id);
        user.credentials.tinder = new TinderCredentials(tinderUserId, tinderToken);
    }
    user.credentials.tinder.token = tinderToken;

    await userRepositoryFactory().save(user);
}

/** Initialize {@link Credentials#once}. */
export async function registerOnceCredentials(userId: string, onceAuthorization: string) {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    if (!user.credentials.once) {
        const onceUserId = await getMe(onceAuthorization).then((x) => x.id);
        user.credentials.once = new OnceCredentials(onceUserId, onceAuthorization);
    }
    user.credentials.once.authorization = onceAuthorization;

    await userRepositoryFactory().save(user);
}

export async function checkCredentials(userId: string): Promise<CredentialStatus> {
    const user = await userRepositoryFactory().findOneById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const providers: CredentialStatus = {};
    for (const providerId of getProviderIds()) {
        if ((user.credentials as any)[providerId]) {
            providers[providerId] = await getProvider(providerId).getMatches((user.credentials as any)[providerId])
                .then(() => Status.UP_TO_DATE)
                .catch(() => Status.EXPIRED);
        } else {
            providers[providerId] = Status.NOT_REGISTERED;
        }
    }

    return providers;
}
