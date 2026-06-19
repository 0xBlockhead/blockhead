import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'


export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}

export enum BridgeRouteSelector {
	Quote = 'quote',
}

export default {
	entityType: EntityType.BridgeRoute,

	label: 'Bridge route',
	labelPlural: 'Bridge routes',

	selectors: [
		{
			name: BridgeRouteSelector.Quote,
			fields: [
				'fromChainId',
				'toChainId',
				'fromToken',
				'toToken',
				'fromAmount',
				'fromAddress',
				'slippage',
				'toAddress',
			],
		},
	],

	fields: [
		{
			name: 'fromChainId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toChainId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromToken',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toToken',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAddress',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slippage',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAddress',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$steps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BridgeRouteStep,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$fromNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'fromAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'toAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'toAmountMin',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'estimatedCostUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'estimatedDurationSeconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BridgeRouteTag).array(),
			cardinality: EntityFieldCardinality.One,
			// LI.FI GET /v1/quote returns one executable route, not BEST/CHEAPEST/FASTEST comparison tags.
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
