// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarLiquidityPool_TimestampSelector {
	LiquidityPoolTimestampMsSource = 'LiquidityPoolTimestampMsSource',
}
export default {
	entityType: EntityType.StellarLiquidityPool_Timestamp,
	label: 'stellar liquidity pool timestamp',
	labelPlural: 'stellar liquidity pool observations',
	selectors: [
		{
			name: StellarLiquidityPool_TimestampSelector.LiquidityPoolTimestampMsSource,
			fields: [
				'$liquidityPool',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$liquidityPool',
				label: 'liquidity pool',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarLiquidityPool,
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
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'ledgerSequence',
				label: 'ledger sequence',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reserveA',
				label: 'reserve a',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reserveB',
				label: 'reserve b',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalShares',
				label: 'total shares',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'accounts',
				label: 'accounts',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
