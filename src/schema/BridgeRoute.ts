import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}
export enum BridgeRouteSelector {
	Quote = 'quote',
	FromChainIdToChainIdFromTokenToTokenFromAmountFromAddressSlippageToAddress = 'fromChainId+toChainId+fromToken+toToken+fromAmount+fromAddress+slippage+toAddress',
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
			label: 'from chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toChainId',
			label: 'to chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromToken',
			label: 'from token',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toToken',
			label: 'to token',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAmount',
			label: 'from amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fromAddress',
			label: 'from address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slippage',
			label: 'slippage',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAddress',
			label: 'to address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$steps',
			label: 'steps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BridgeRouteStep,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$fromNetwork',
			label: 'from network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$toNetwork',
			label: 'to network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmount',
			label: 'to amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'toAmountMin',
			label: 'to amount min',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'estimatedCostUsd',
			label: 'estimated cost usd',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'estimatedDurationSeconds',
			label: 'estimated duration seconds',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tags',
			label: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
