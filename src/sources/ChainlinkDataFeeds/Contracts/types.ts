import { Source } from '$/sources/Source.ts'

export type ChainlinkLatestRound = {
	network: `eip155:${string}`
	feedAddress: `0x${string}`
	aggregatorAddress: `0x${string}`
	baseAsset: string
	quoteAsset: string
	description: string
	decimals: number
	roundId: string
	answer: string
	startedAtSeconds: string
	updatedAtSeconds: string
	answeredInRound: string
	blockNumber: string
	source: Source.ChainlinkDataFeeds_Contracts
	resolvedAtMs: number
	staleAfterMs: number
	ageMs: number
	stale: boolean
}

export type ChainlinkJsonRpcResponse = {
	jsonrpc: string
	id: string
	result?: string
	error?: {
		code: number
		message: string
	}
}
