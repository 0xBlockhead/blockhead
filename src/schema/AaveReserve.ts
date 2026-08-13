// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AaveReserve,
	labels: {
		singular: 'Aave reserve',
		plural: 'Aave reserves',
	},
	description: 'A token reserve configured within an Aave V3 lending market.',
})({
	$market: {
		entityType: EntityType.AaveMarket,
		cardinality: EntityFieldCardinality.One,
	},
	underlyingTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	decimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	imageUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	totalSupplied: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	availableLiquidity: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	supplyApy: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	borrowApy: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	liquidationThreshold: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	frozen: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	paused: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
})({
	selectors: {
		MarketUnderlyingTokenAddress: [
			'$market',
			'underlyingTokenAddress',
		],
	},
})
