/**
 * Public Snapchain node endpoints used for protocol-native `/v1/*` reads.
 *
 * @see https://snapchain.farcaster.xyz/getting-started
 * @see https://snapchain.farcaster.xyz/reference/httpapi/httpapi
 * @see https://github.com/farcasterorg/hypersnap
 */

export enum SnapchainNodeEndpointId {
	Pinata = 'Pinata',
	Snap = 'Snap',
	Pop = 'Pop',
	Haatz = 'Haatz',
}

export type SnapchainNodeEndpoint = {
	id: SnapchainNodeEndpointId
	url: string
}

export const snapchainDefaultShardId = 1

export const snapchainNodeEndpoints = [
	{ id: SnapchainNodeEndpointId.Pinata, url: 'https://hub.pinata.cloud' },
	{ id: SnapchainNodeEndpointId.Snap, url: 'https://snap.farcaster.xyz:3381' },
	{ id: SnapchainNodeEndpointId.Pop, url: 'https://pop.farcaster.xyz:3381' },
	{ id: SnapchainNodeEndpointId.Haatz, url: 'https://haatz.quilibrium.com' },
] as const satisfies readonly SnapchainNodeEndpoint[]
