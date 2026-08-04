/**
 * Curve Finance REST wire shapes (`api.curve.finance/v1`).
 * @see https://api.curve.finance/v1/documentation/
 */
import { type as arktype } from 'arktype'

export type CurvePoolListItemWire = {
	type: string
	address: string
}

export type CurvePoolListResponse = {
	success: boolean
	data: {
		poolList: CurvePoolListItemWire[]
	}
}

export type CurvePoolCoinWire = {
	address: string
	decimals: string
	symbol: string
	name: string
	poolBalance?: string
	usdPrice?: number | null
	isBasePoolLpToken?: boolean
}

export type CurvePoolWire = {
	id: string
	address: string
	name: string
	symbol: string
	lpTokenAddress: string
	coinsAddresses: string[]
	decimals: string[]
	coins: CurvePoolCoinWire[]
	virtualPrice?: string | null
	amplificationCoefficient?: string | null
	totalSupply?: string | null
	usdTotal?: number | null
	isMetaPool?: boolean
	gaugeAddress?: string | null
	assetTypeName?: string | null
	creationBlockNumber?: number | null
	creationTs?: number | null
}

export type CurvePoolsResponse = {
	success: boolean
	data: {
		poolData: CurvePoolWire[]
	}
}

const curvePoolCoinEnvelope = arktype({
	address: 'string',
	decimals: 'string',
	symbol: 'string',
	name: 'string',
	'poolBalance?': 'string',
	'usdPrice?': 'number | null',
	'isBasePoolLpToken?': 'boolean',
})
const curvePoolEnvelope = arktype({
	id: 'string',
	address: 'string',
	name: 'string',
	symbol: 'string',
	lpTokenAddress: 'string',
	coinsAddresses: 'string[]',
	decimals: 'string[]',
	coins: curvePoolCoinEnvelope.array(),
	'virtualPrice?': 'string | null',
	'amplificationCoefficient?': 'string | null',
	'totalSupply?': 'string | null',
	'usdTotal?': 'number | null',
	'isMetaPool?': 'boolean',
	'gaugeAddress?': 'string | null',
	'assetTypeName?': 'string | null',
	'creationBlockNumber?': 'number | null',
	'creationTs?': 'number | null',
})

export const curvePoolListEnvelope = arktype({
	success: 'true',
	data: {
		poolList: arktype({
			type: 'string',
			address: 'string',
		}).array(),
	},
})
export const curvePoolsEnvelope = arktype({
	success: 'true',
	data: {
		poolData: curvePoolEnvelope.array(),
	},
})

export type CurvePoolListItem = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
}

export type CurvePoolSnapshot = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
	name: string
	symbol: string
	lpTokenAddress: `0x${string}`
	coinAddresses: `0x${string}`[]
	virtualPrice?: string
	amplificationCoefficient?: string
	totalSupply?: string
	usdTotal?: number
	isMetaPool?: boolean
	gaugeAddress?: `0x${string}`
	assetTypeName?: string
	creationBlockNumber?: number
	creationTs?: number
}
