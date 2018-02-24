import {OnceCredentials, TinderCredentials, User} from "../database/entities";
import {userRepositoryFactory} from "../database/repositories";
import {CredentialStatus, Status} from "../dto";
import {NotFoundException} from "../exceptions";
import {getMe} from "../providers/once/once-client";
import {getProviderKeys, providerFactory, ProviderKey} from "../providers/provider";
import {getProviderAction} from "../providers/providerAction";
import {getMeta} from "../providers/tinder/tinder-client";

/**
 * @param tinderToken {@link User#token}
 * @return {Promise<string>} {@link User#id}
 */
export async function login(providerKey: ProviderKey, secret: string): Promise<string> {
    const providerUserId = await getProviderAction(providerKey).getUserId(secret);

    let user = await userRepositoryFactory().findOneByCredentialUserId(providerKey, providerUserId);

    // create account if not exists
    if (!user) {
        user = new User();
        providerFactory<void>(providerKey, {
            once: () => user!.credentials.once = new OnceCredentials(providerUserId, secret),
            tinder: () => user!.credentials.tinder = new TinderCredentials(providerUserId, secret),
        });
    }

    // refresh token
    providerFactory<void>(providerKey, {
        once: () => user!.credentials.once!.authorization = secret,
        tinder: () => user!.credentials.tinder!.token = secret,
    });

    await userRepositoryFactory().save(user);

    return user.id!.toHexString();
}

export async function registerCredentials(userId: string, providerKey: ProviderKey, secret: any) {
    return providerFactory(providerKey, {
        once: () => registerOnceCredentials(userId, secret),
        tinder: () => registerTinderCredentials(userId, secret),
    });
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
    for (const providerKey of getProviderKeys()) {
        if (user.credentials[providerKey]) {
            providers[providerKey] = await getProviderAction(providerKey).getMatches(user.credentials[providerKey]!)
                .then(() => Status.UP_TO_DATE)
                .catch(() => Status.EXPIRED);
        } else {
            providers[providerKey] = Status.NOT_REGISTERED;
        }
    }

    return providers;
}
