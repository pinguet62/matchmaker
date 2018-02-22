export interface IProviderId {
    provider: string;
    id: string;
}

/** Should be reverse function of {@link parseProviderId}. */
export function formatProviderId(providerId: IProviderId): string {
    return `${providerId.provider}_${providerId.id}`;
}

/** Should be reverse function of {@link formatProviderId}. */
export function parseProviderId(providerId: string): IProviderId {
    const data = providerId.split("_");
    return {
        id: data[1],
        provider: data[0],
    };
}
