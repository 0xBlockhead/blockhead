// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BridgeRouteQuoteStep,
	labels: {
		singular: 'bridge route quote step',
		plural: 'bridge route quote steps',
	},
})({
	$quote: {
		entityType: EntityType.BridgeRouteQuote_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	indexInQuote: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	providerStepId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stepType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tool: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromToken: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toToken: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAmountMin: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	estimatedGas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	railId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	settlementModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetOutcome: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		QuoteIndexInQuote: [
			'$quote',
			'indexInQuote',
		],
	},
})
