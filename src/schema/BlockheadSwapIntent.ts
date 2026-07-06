// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadSwapIntentSelector {
	SessionIdActionId = 'SessionIdActionId',
}
export default {
	entityType: EntityType.BlockheadSwapIntent,
	label: 'blockhead swap intent',
	labelPlural: 'blockhead swap intents',
	selectors: [
		{
			name: BlockheadSwapIntentSelector.SessionIdActionId,
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
			name: 'networkCaip2',
			label: 'network CAIP-2',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'namespace': type('string'), 'reference': type('string') }),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetInCaip19',
			label: 'asset in CAIP-19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetOutCaip19',
			label: 'asset out CAIP-19',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainId',
			label: 'Chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenInAddress',
			label: 'token in address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenOutAddress',
			label: 'token out address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$evmNetwork',
			label: 'EVM network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tokenIn',
			label: 'token in',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tokenOut',
			label: 'token out',
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
