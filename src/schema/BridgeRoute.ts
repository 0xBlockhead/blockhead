// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}
export enum BridgeRouteSelector {
	Quote = 'Quote',
}
export default {
	entityType: EntityType.BridgeRoute,
	label: 'bridge route',
	labelPlural: 'bridge routes',
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
			label: 'From chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toChainId',
			label: 'To chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromToken',
			label: 'From token',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toToken',
			label: 'To token',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAmount',
			label: 'From amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAddress',
			label: 'From address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slippage',
			label: 'Slippage',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAddress',
			label: 'To address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$steps',
			label: 'Steps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BridgeRouteStep,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lifi_Rest,
			],
		},
		{
			name: '$fromNetwork',
			label: 'From network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			label: 'To network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmount',
			label: 'To amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmountMin',
			label: 'To amount min',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'estimatedCostUsd',
			label: 'Estimated cost USD',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'estimatedDurationSeconds',
			label: 'Estimated duration seconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tags',
			label: 'Tags',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
