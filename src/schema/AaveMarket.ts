// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AaveMarket,
	labels: {
		singular: 'Aave market',
		plural: 'Aave markets',
	},
	description: 'An Aave V3 lending market (Pool) on an EIP-155 network, identified by pool address.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolAddress: {
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
	icon: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	totalMarketSize: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	totalAvailableLiquidity: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
	$$reserves: {
		entityType: EntityType.AaveReserve,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Aave_Rest,
		],
	},
})({
	selectors: {
		NetworkPoolAddress: [
			'$network',
			'poolAddress',
		],
	},
})
