import type { JsonValue } from '$/typescript/JsonValue.ts'

export type HyperliquidMeta = {
	universe: {
		name: string
		szDecimals: number
		maxLeverage: number
		onlyIsolated?: boolean
	}[]
}

export type HyperliquidSpotMeta = {
	tokens: {
		name: string
		szDecimals: number
		weiDecimals: number
		index: number
		tokenId?: string
	}[]
	universe: {
		name: string
		tokens: [number, number]
		index: number
		isCanonical?: boolean
	}[]
}

export type HyperliquidClearinghouseState = {
	marginSummary: JsonValue
	crossMarginSummary: JsonValue
	assetPositions: JsonValue[]
	withdrawable: string
}

export type HyperliquidUserRole = (
	| {
		role: 'agent'
		data: {
			user: string
		}
	}
	| {
		role: 'subAccount'
		data: {
			master: string
		}
	}
	| {
		role: 'user' | 'vault' | 'missing'
	}
)

export type HyperliquidValidatorSummary = {
	validator: string
	signer: string
	name: string
	description: string
	nRecentBlocks: number
	stake: number
	isJailed: boolean
	isActive: boolean
	commission: string
}
