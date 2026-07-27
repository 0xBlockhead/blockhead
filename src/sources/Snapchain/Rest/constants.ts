/**
 * Public Snapchain node endpoints used for protocol-native `/v1/*` reads.
 *
 * @see https://snapchain.farcaster.xyz/getting-started
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 * @see https://github.com/farcasterorg/hypersnap
 */

export const defaultShardId = 1

/**
 * Default `pageSize` for most Snapchain paged reads (`/fids`, reactions, user data, proofs, verifications).
 * Matches the practical maximum per request; resolvers cap with `min(remaining, this)`.
 */
export const snapchainMaxPageSize = 100

/** Default `pageSize` for cast timelines (`/castsByFid`, `/castsByParent`). */
export const snapchainDefaultCastTimelinePageSize = 25
