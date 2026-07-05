// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BridgeRouteQuote_TimestampSelector {
	SourceQuoteRequestHashTimestampMs = 'SourceQuoteRequestHashTimestampMs',
}
export default {
	entityType: EntityType.BridgeRouteQuote_Timestamp,
	label: 'bridge route quote timestamp',
	labelPlural: 'bridge route quote observations',
	selectors: [
		{
			name: BridgeRouteQuote_TimestampSelector.SourceQuoteRequestHashTimestampMs,
			fields: [
				'source',
				'quoteRequestHash',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'quoteRequestHash',
				label: 'quote request hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'providerQuoteId',
				label: 'provider quote ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromChainId',
				label: 'from chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'toChainId',
				label: 'to chain ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fromToken',
				label: 'from token',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'toToken',
				label: 'to token',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fromAmount',
				label: 'from amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fromAddress',
				label: 'from address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slippage',
				label: 'slippage',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'toAddress',
				label: 'to address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
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
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toAmountMin',
				label: 'to amount min',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'estimatedCostUsd',
				label: 'estimated cost usd',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'estimatedDurationSeconds',
				label: 'estimated duration seconds',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'approvalAddress',
				label: 'approval address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionTo',
				label: 'transaction to',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionDataHash',
				label: 'transaction data hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tags',
				label: 'tags',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$steps',
				label: 'steps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BridgeRouteQuoteStep,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
