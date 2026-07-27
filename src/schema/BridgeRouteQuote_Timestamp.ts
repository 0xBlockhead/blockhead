// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeRouteQuote_Timestamp,
	labels: {
		singular: 'bridge route quote timestamp',
		plural: 'bridge route quote observations',
	},
})({
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteRequestHash: {
		label: 'quote request hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerQuoteId: {
		label: 'provider quote ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromChainId: {
		label: 'from chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		label: 'to chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		label: 'from token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		label: 'to token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		label: 'from amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		label: 'from address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		label: 'slippage',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		label: 'to address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$fromNetwork: {
		label: 'from network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'to network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		label: 'to amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAmountMin: {
		label: 'to amount min',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedCostUsd: {
		label: 'estimated cost usd',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedDurationSeconds: {
		label: 'estimated duration seconds',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	approvalAddress: {
		label: 'approval address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionTo: {
		label: 'transaction to',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionDataHash: {
		label: 'transaction data hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		label: 'tags',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
		label: 'steps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BridgeRouteQuoteStep,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SourceQuoteRequestHashTimestampMs: [
			'source',
			'quoteRequestHash',
			'timestampMs',
		],
	},
})
