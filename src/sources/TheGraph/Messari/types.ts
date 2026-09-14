import { type } from 'arktype'
import { EvmAddress, Hash32 } from '$/schema/ZeroExHex.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'

const financialDecimal = type('string').matching(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)
export const graphInt = type('number.integer >= 0').and(type('number.integer <= 2147483647'))
export const graphBytesId = type('string').matching(/^0x(?:[0-9a-f]{2})+$/)
export const messariLiquidityPoolFeeType = type.enumerated(
	'FIXED_TRADING_FEE', 'TIERED_TRADING_FEE', 'DYNAMIC_TRADING_FEE',
	'FIXED_LP_FEE', 'DYNAMIC_LP_FEE', 'FIXED_PROTOCOL_FEE', 'DYNAMIC_PROTOCOL_FEE',
	'FIXED_STAKE_FEE', 'DYNAMIC_STAKE_FEE', 'DEPOSIT_FEE', 'WITHDRAWAL_FEE',
	'DYNAMIC_TAKER_FEE', 'DYNAMIC_TAKER_DELAYED_FEE', 'DYNAMIC_TAKER_DELAYED_OFFCHAIN_FEE',
	'DYNAMIC_MAKER_FEE', 'DYNAMIC_MAKER_DELAYED_FEE', 'DYNAMIC_MAKER_DELAYED_OFFCHAIN_FEE',
)
export const messariLiquidityPoolFee = type({
	id: 'string',
	feePercentage: NonNegativeDecimalString.or('null'),
	feeType: messariLiquidityPoolFeeType,
})
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
	liquidityPools: type({ id: EvmAddress }).array(),
})

export const protocolFinancialsAtBlockWire = protocolFinancialsWire.omit('liquidityPools')

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
