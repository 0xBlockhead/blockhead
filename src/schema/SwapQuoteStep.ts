// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SwapQuoteStep,
	labels: {
		singular: 'swap quote step',
		plural: 'swap quote steps',
	},
})({
	$quote: {
		entityType: EntityType.SwapQuote_Timestamp,
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
	protocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	poolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$liquidityPool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenIn: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenOut: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountIn: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountOut: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeBps: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shareBps: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasEstimate: {
		primitiveType: type('bigint'),
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
