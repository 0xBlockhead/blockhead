// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SwapQuoteStepSelector {
	QuoteIndexInQuote = 'QuoteIndexInQuote',
}
export default {
	entityType: EntityType.SwapQuoteStep,
	label: 'swap quote step',
	labelPlural: 'swap quote steps',
	selectors: [
		{
			name: SwapQuoteStepSelector.QuoteIndexInQuote,
			fields: [
				'$quote',
				'indexInQuote',
			],
		},
	],
	fields: [
		{
			name: '$quote',
			label: 'quote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SwapQuote_Timestamp,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInQuote',
			label: 'index in quote',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'providerStepId',
			label: 'provider step ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stepType',
			label: 'step type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protocol',
			label: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'poolId',
			label: 'pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$liquidityPool',
			label: 'liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
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
			name: 'amountIn',
			label: 'amount in',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountOut',
			label: 'amount out',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeBps',
			label: 'fee bps',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'shareBps',
			label: 'share bps',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'gasEstimate',
			label: 'gas estimate',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
