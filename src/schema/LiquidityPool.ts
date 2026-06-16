import { type } from 'arktype'

// Concentrated-liquidity AMM pool row. Dexscreener-backed slices expose pair tokens, volume, and TVL only; on-chain curve fields are optional until an execution RPC or pool indexer maps them.
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { UrlString } from '$/schema/UrlString.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum LiquidityPoolSelector {
	EvmNetworkId = 'evmNetworkId',
}

export default {
	entityType: EntityType.LiquidityPool,

	label: 'Liquidity Pool',
	labelPlural: 'Liquidity Pools',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baseToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: '$quoteToken',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tickSpacing',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$hooks',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'v4PoolId',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LiquidityPool_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LiquidityPool_Block,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'baseTokenSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'quoteTokenSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'baseTokenDecimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteTokenDecimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pairCreatedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'dexscreenerLabels',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'dexId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'dexscreenerPairUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
