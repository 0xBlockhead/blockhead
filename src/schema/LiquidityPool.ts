// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseToken: {
		label: 'Base token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	$quoteToken: {
		label: 'Quote token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	fee: {
		label: 'Fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tickSpacing: {
		label: 'Tick spacing',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$hooks: {
		label: 'Hooks',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	v4PoolId: {
		label: 'v4 pool ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LiquidityPool_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	$$blocks: {
		label: 'Blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LiquidityPool_Block,
		cardinality: EntityFieldCardinality.Many,
	},
	$$leverages: {
		label: 'Leverage positions',
		type: EntityFieldType.EntitiesReference,
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
