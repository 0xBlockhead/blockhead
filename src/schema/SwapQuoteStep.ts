// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SwapQuote_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	indexInQuote: {
		label: 'index in quote',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	providerStepId: {
		label: 'provider step ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stepType: {
		label: 'step type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocol: {
		label: 'protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	poolId: {
		label: 'pool ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$liquidityPool: {
		label: 'liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenIn: {
		label: 'token in',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$tokenOut: {
		label: 'token out',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountIn: {
		label: 'amount in',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountOut: {
		label: 'amount out',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeBps: {
		label: 'fee bps',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shareBps: {
		label: 'share bps',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasEstimate: {
		label: 'gas estimate',
		type: EntityFieldType.Primitive,
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
