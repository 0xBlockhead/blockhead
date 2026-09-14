// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LiquidityPool,
	labels: {
		singular: 'liquidity pool',
		plural: 'liquidity pools',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$financialProtocol: {
		entityType: EntityType.FinancialProtocol,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ammObservations: {
		entityType: EntityType.LiquidityPool_Amm_EvmBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$feeSchedules: {
		entityType: EntityType.LiquidityPoolFeeSchedule,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TheGraph_Graphql,
		],
	},
	name: {
		primitiveType: type("string | null"),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		primitiveType: type("string | null"),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isSingleSided: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdBlockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$baseToken: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	$quoteToken: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	fee: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$hooks: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v4PoolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.LiquidityPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	$$blocks: {
		entityType: EntityType.LiquidityPool_Block,
		cardinality: EntityFieldCardinality.Many,
	},
	$$leverages: {
		entityType: EntityType.Leverage,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkId: [
			'$network',
			'id',
		],
	},
})
