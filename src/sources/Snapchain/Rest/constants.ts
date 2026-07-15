/**
 * Public Snapchain node endpoints used for protocol-native `/v1/*` reads.
 *
 * @see https://snapchain.farcaster.xyz/getting-started
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 * @see https://github.com/farcasterorg/hypersnap
 */

import {
	SnapchainNodeEndpointId,
	type SnapchainNodeEndpoint,
} from '$/sources/Snapchain/Rest/types.ts'

export const defaultShardId = 1

/**
 * Default `pageSize` for most Snapchain paged reads (`/fids`, reactions, user data, proofs, verifications).
 * Matches the practical maximum per request; resolvers cap with `min(remaining, this)`.
 */
export const snapchainMaxPageSize = 100

/** Default `pageSize` for cast timelines (`/castsByFid`, `/castsByParent`). */
export const snapchainDefaultCastTimelinePageSize = 25

export const nodeEndpoints = [
	{ id: SnapchainNodeEndpointId.Pinata, url: 'https://hub.pinata.cloud' },
	{ id: SnapchainNodeEndpointId.Snap, url: 'https://snap.farcaster.xyz:3381' },
	{ id: SnapchainNodeEndpointId.Pop, url: 'https://pop.farcaster.xyz:3381' },
	{ id: SnapchainNodeEndpointId.Haatz, url: 'https://haatz.quilibrium.com' },
] as const satisfies readonly SnapchainNodeEndpoint[]

export const snapchainOrigins = nodeEndpoints.map((endpoint) => ({
	origin: new URL(endpoint.url).origin,
	corsEnabled: false,
}))
