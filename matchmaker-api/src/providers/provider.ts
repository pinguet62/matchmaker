import {Credentials, ICredentials} from "../database/entities";
import {getProviderAction, IProviderAction} from "./providerAction";

export interface IProvider<T> {
    once: T;
    tinder: T;
}

// TODO polish this workaround (for entity)
export interface IProviderOptional<T> {
    once?: T;
    tinder?: T;
}

export type ProviderKey = keyof IProvider<void>;

/**
 * Unique ID for this application,
 * is the pair: provider key + provider'ID.
 */
export interface IProviderId {
    providerKey: ProviderKey;
    id: string;
}

/** Should be reverse function of {@link parseProviderId}. */
export function formatProviderId(providerId: IProviderId): string {
    return `${providerId.providerKey}_${providerId.id}`;
}

/** Should be reverse function of {@link formatProviderId}. */
export function parseProviderId(providerId: string): IProviderId {
    const data = providerId.split("_");
    return {
        id: data[1],
        providerKey: data[0] as ProviderKey,
    };
}

export function getProviderKeys(): ProviderKey[] {
    return ["once", "tinder"];
}

export class UnsupportedProviderError extends Error {
    constructor(providerKey: ProviderKey) {
        super(`Unknown provider ${providerKey}`);
    }
}

/** Factory method used for *type safe* switch between each provider. */
export function providerFactory<T>(providerKey: ProviderKey, providerFcts: IProvider<() => T>): T {
    const fct = providerFcts[providerKey];
    if (!fct) {
        throw new UnsupportedProviderError(providerKey);
    }
    return fct();
}

export async function forEachProvider<T>(
    credentials: Credentials,
    fct: (providerAction: IProviderAction, providerCredentials: ICredentials) => Promise<T[]>,
): Promise<T[]> {
    let results: T[] = [];
    for (const providerKey of getProviderKeys()) {
        if (credentials[providerKey]) {
            const providerAction = getProviderAction(providerKey);
            const providerCredentials = credentials[providerKey] as ICredentials;
            results = results.concat(await fct(providerAction, providerCredentials));
        }
    }
    return results;
}
