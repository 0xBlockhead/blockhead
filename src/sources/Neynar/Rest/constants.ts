/**
 * Neynar REST API — host only (paths appended by client).
 * @see https://docs.neynar.com/reference
 */
export const origin = 'https://api.neynar.com' as const

export const baseUrl = origin

/** Default `limit` for `GET /v2/farcaster/feed/` when omitted. */
export const neynarFeedDefaultLimit = 25

/** Maximum `limit` allowed by Neynar feed requests. */
export const neynarFeedMaxLimit = 100
