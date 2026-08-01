// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BridgeRouteTag } from '$/schema/BridgeRouteTag.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteRequestHash: {
		label: 'quote request hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerQuoteId: {
		label: 'provider quote ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromChainId: {
		label: 'from chain ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		label: 'to chain ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		label: 'from token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		label: 'to token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		label: 'from amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		label: 'slippage',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		label: 'to address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$fromNetwork: {
		label: 'from network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		label: 'to network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		label: 'to amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAmountMin: {
		label: 'to amount min',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedCostUsd: {
		label: 'estimated cost usd',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedDurationSeconds: {
		label: 'estimated duration seconds',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	approvalAddress: {
		label: 'approval address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionTo: {
		label: 'transaction to',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionDataHash: {
		label: 'transaction data hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		label: 'tags',
		primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
		label: 'steps',
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
