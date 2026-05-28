import type { JsonValue } from '$/typescript/JsonValue.ts'

export type LotusTipset = {
	Cids: { '/': string }[]
	Blocks: LotusBlockHeader[]
	Height: number
}

export type LotusBlockHeader = {
	Miner: string
	Ticket?: JsonValue
	ElectionProof?: {
		WinCount?: number
		VRFProof?: string
	}
	Parents: { '/': string }[]
	ParentWeight: string
	Height: number
	Timestamp: number
	Messages: { '/': string }
}

export type LotusMessage = {
	Version: number
	To: string
	From: string
	Nonce: number
	Value: string
	GasLimit: number
	GasFeeCap: string
	GasPremium: string
	Method: number
	Params: string
}

export type LotusActor = {
	Code: { '/': string }
	Head: { '/': string }
	Nonce: number
	Balance: string
}

export type LotusSectorOnChainInfo = {
	SectorNumber: number
	SealedCID?: { '/': string }
	Activation: number
	Expiration: number
}
