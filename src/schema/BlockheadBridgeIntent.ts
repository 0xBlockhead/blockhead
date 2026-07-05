// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadBridgeIntentSelector {
	SessionIdActionId = 'SessionIdActionId',
}
export default {
	entityType: EntityType.BlockheadBridgeIntent,
	label: 'blockhead bridge intent',
	labelPlural: 'blockhead bridge intents',
	selectors: [
		{
			name: BlockheadBridgeIntentSelector.SessionIdActionId,
			fields: [
				'sessionId',
				'actionId',
			],
		},
	],
	fields: [
		{
				name: 'sessionId',
				label: 'session ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'actionId',
				label: 'action ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$sessionAction',
				label: 'session action',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadSessionAction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fromNetworkCaip2',
				label: 'from network CAIP-2',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toNetworkCaip2',
				label: 'to network CAIP-2',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'assetCaip19',
				label: 'asset CAIP-19',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromAssetCaip19',
				label: 'from asset CAIP-19',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toAssetCaip19',
				label: 'to asset CAIP-19',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromChainId',
				label: 'from chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toChainId',
				label: 'to chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'coinId',
				label: 'coin ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromTokenAddress',
				label: 'from token address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toTokenAddress',
				label: 'to token address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$fromNetwork',
				label: 'from network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$toNetwork',
				label: 'to network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$fromEvmNetwork',
				label: 'from EVM network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$toEvmNetwork',
				label: 'to EVM network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$fromToken',
				label: 'from token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$toToken',
				label: 'to token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amount',
				label: 'amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slippage',
				label: 'slippage',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$quotes',
				label: 'quotes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadIntentQuote,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
