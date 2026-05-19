/**
 * AT Protocol public read client (Bluesky appview). Wire: HTTPS + XRPC.
 * @see https://docs.bsky.app/docs/api/content-reference
 */


// Constants
export const atprotoPublicAppViewOrigin = 'https://public.api.bsky.app' as const

export const atprotoPublicAppViewXrpcBase = `${atprotoPublicAppViewOrigin}/xrpc` as const
