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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteRequestHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	providerQuoteId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromChainId: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toChainId: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	fromToken: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	toToken: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	fromAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	slippage: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	toAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$fromNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$toNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	toAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAmountMin: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedCostUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedDurationSeconds: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	approvalAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionTo: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionDataHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tags: {
		primitiveType: type.enumerated(...Object.values(BridgeRouteTag)).array(),
		cardinality: EntityFieldCardinality.One,
	},
	$$steps: {
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
