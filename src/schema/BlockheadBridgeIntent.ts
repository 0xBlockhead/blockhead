// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadBridgeIntentSelector {
	SessionIdActionId = 'SessionIdActionId',
}
export const BlockheadBridgeIntent = entity({
	entityType: EntityType.BlockheadBridgeIntent,
	labels: {
		singular: 'blockhead bridge intent',
		plural: 'blockhead bridge intents',
	},
})({
	sessionId: {
		label: 'session ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionId: {
		label: 'action ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.One,
	},
	fromNetworkCaip2: {
		label: 'from network CAIP-2',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toNetworkCaip2: {
		label: 'to network CAIP-2',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetCaip19: {
		label: 'asset CAIP-19',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAssetCaip19: {
		label: 'from asset CAIP-19',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAssetCaip19: {
		label: 'to asset CAIP-19',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromChainId: {
		label: 'from chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toChainId: {
		label: 'to chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinId: {
		label: 'coin ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromTokenAddress: {
		label: 'from token address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toTokenAddress: {
		label: 'to token address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromNetwork: {
		label: 'from network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toNetwork: {
		label: 'to network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromEvmNetwork: {
		label: 'from EVM network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toEvmNetwork: {
		label: 'to EVM network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromToken: {
		label: 'from token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toToken: {
		label: 'to token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slippage: {
		label: 'slippage',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$quotes: {
		label: 'quotes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadIntentQuote,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SessionIdActionId: [
			'sessionId',
			'actionId',
		],
	},
})
