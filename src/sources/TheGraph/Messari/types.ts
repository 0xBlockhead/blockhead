import { type } from 'arktype'
import { Hash32 } from '$/schema/ZeroExHex.ts'

const financialDecimal = type('string').matching(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)
export const graphInt = type('number.integer >= 0').and(type('number.integer <= 2147483647'))
export const protocolFinancialsWire = type({
	_meta: {
		deployment: 'string',
		hasIndexingErrors: 'boolean',
		block: {
			number: graphInt,
			hash: Hash32.or('null'),
			timestamp: graphInt.or('null'),
		},
	},
	dexAmmProtocols: type({
		id: 'string',
		name: 'string',
		network: 'string',
		schemaVersion: 'string',
		subgraphVersion: 'string',
		methodologyVersion: 'string',
		totalValueLockedUSD: financialDecimal,
		cumulativeVolumeUSD: financialDecimal,
		cumulativeSupplySideRevenueUSD: financialDecimal,
		cumulativeProtocolSideRevenueUSD: financialDecimal,
		cumulativeTotalRevenueUSD: financialDecimal,
		totalPoolCount: graphInt,
	}).array(),
})

export const blockMetadataWire = type({
	_meta: {
		deployment: 'string',
		hasIndexingErrors: 'boolean',
		block: {
			number: graphInt,
			hash: Hash32.or('null'),
			timestamp: graphInt.or('null'),
		},
	},
})

export type MessariGraphqlFinancialsWire = typeof protocolFinancialsWire.infer
