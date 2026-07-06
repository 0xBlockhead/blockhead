// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LiquidityPoolSelector {
	EvmNetworkId = 'EvmNetworkId',
}
export default {
	entityType: EntityType.LiquidityPool,
	label: 'liquidity pool',
	labelPlural: 'liquidity pools',
	selectors: [
		{
			name: LiquidityPoolSelector.EvmNetworkId,
			fields: [
				'$network',
				'id',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'id',
			label: 'ID',
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baseToken',
			label: 'Base token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: '$quoteToken',
			label: 'Quote token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'fee',
			label: 'Fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tickSpacing',
			label: 'Tick spacing',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$hooks',
			label: 'Hooks',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'v4PoolId',
			label: 'v4 pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LiquidityPool_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LiquidityPool_Block,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$leverages',
			label: 'Leverage positions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Leverage,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
