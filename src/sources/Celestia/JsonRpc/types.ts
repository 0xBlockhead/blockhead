import type { JsonValue } from '$/typescript/JsonValue.ts'

export type CelestiaExtendedHeader = {
	chainId: string
	height: bigint
	hash: string
	parentHash?: string
	dataHash: string
	appHash: string
	proposerAddress: string
	time: string
}

export type CelestiaHeaderSyncState = {
	fromHeight: bigint
	toHeight: bigint
}

export type CelestiaBlobProof = JsonValue
