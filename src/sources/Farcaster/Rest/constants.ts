/**
 * Farcaster Client API — host only (paths appended by client).
 * @see https://docs.farcaster.xyz/reference/farcaster/api
 */
export const clientOrigin = 'https://api.farcaster.xyz' as const

export const clientBaseUrl = clientOrigin

export const webBaseUrl = 'https://farcaster.xyz'

/** Default `limit` for `GET /v2/all-channels` pagination in {@link getAllChannelsPage}. */
export const farcasterRestAllChannelsPageLimit = 100

/** Default `limit` for `GET /~api/v2/user-thread-casts`. */
export const farcasterRestUserThreadCastsLimit = 15
