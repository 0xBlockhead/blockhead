import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { Source } from '$/sources/$Source.ts'


export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}

/** Quote parameters keyed in {@link EntityType.BridgeRoute} ids (LI.FI `GET /v1/quote`). */
export const bridgeRouteQuoteId = type({
	fromChainId: 'number',
	toChainId: 'number',
	fromToken: 'string',
	toToken: 'string',
	fromAmount: 'string',
	fromAddress: EvmAddress,
	slippage: 'number',
	'toAddress?': EvmAddress,
})

export default {
	entityType: EntityType.BridgeRoute,

	label: 'Bridge route',
	labelPlural: 'Bridge routes',

	id: bridgeRouteQuoteId,

	fields: [
		{
			name: '$$steps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BridgeRouteStep,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: '$fromNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: '$toNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'fromAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'toAmount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'toAmountMin',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'gasCostUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
		{
			name: 'estimatedDurationSeconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
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
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
