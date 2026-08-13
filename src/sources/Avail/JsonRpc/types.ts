/**
 * Avail Substrate JSON-RPC wire shapes (fail-closed arktype envelopes).
 * Tip / header / block / health / sync — enrolled DA surfaces only.
 */

import { type as arktype } from 'arktype'


/** Fail-closed `chain_getHeader` envelope. */
export const availHeaderWire = arktype({
	parentHash: 'string',
	number: 'string',
	stateRoot: 'string',
	extrinsicsRoot: 'string',
	digest: {
		logs: 'string[]',
	},
})

export type AvailHeader = typeof availHeaderWire.infer

/** Fail-closed `chain_getBlock` envelope. */
export const availBlockWire = arktype({
	block: {
		header: availHeaderWire,
		extrinsics: 'string[]',
	},
})

export type AvailBlock = typeof availBlockWire.infer

/** Fail-closed `kate_queryDataProof` envelope. */
export const availDataProofWire = arktype({
	dataProof: {
		roots: {
			dataRoot: 'string',
			blobRoot: 'string',
			bridgeRoot: 'string',
		},
		proof: 'string[]',
		numberOfLeaves: 'number.integer >= 0',
		leafIndex: 'number.integer >= 0',
		leaf: 'string',
	},
	'message?': 'unknown',
})

export type AvailDataProof = typeof availDataProofWire.infer

/** Fail-closed `system_health` envelope. */
export const availSystemHealthWire = arktype({
	peers: 'number.integer >= 0',
	isSyncing: 'boolean',
	shouldHavePeers: 'boolean',
})

export type AvailSystemHealth = typeof availSystemHealthWire.infer

/** Fail-closed `system_syncState` envelope. */
export const availSystemSyncStateWire = arktype({
	startingBlock: 'number.integer >= 0',
	currentBlock: 'number.integer >= 0',
	highestBlock: 'number.integer >= 0',
})

export type AvailSystemSyncState = typeof availSystemSyncStateWire.infer
