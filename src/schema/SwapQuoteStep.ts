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
		label: 'quote',
		entityType: EntityType.SwapQuote_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	indexInQuote: {
		label: 'index in quote',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerStepId: {
		label: 'provider step ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stepType: {
		label: 'step type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocol: {
		label: 'protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	poolId: {
		label: 'pool ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$liquidityPool: {
		label: 'liquidity pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenIn: {
		label: 'token in',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenOut: {
		label: 'token out',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountIn: {
		label: 'amount in',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountOut: {
		label: 'amount out',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeBps: {
		label: 'fee bps',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shareBps: {
		label: 'share bps',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasEstimate: {
		label: 'gas estimate',
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
