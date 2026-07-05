// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DydxChainSubaccount_TimestampSelector {
	SubaccountTimestampMsSource = 'SubaccountTimestampMsSource',
}
export default {
	entityType: EntityType.DydxChainSubaccount_Timestamp,
	label: 'dydx chain subaccount timestamp',
	labelPlural: 'dydx chain subaccount observations',
	selectors: [
		{
			name: DydxChainSubaccount_TimestampSelector.SubaccountTimestampMsSource,
			fields: [
				'$subaccount',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$subaccount',
				label: 'subaccount',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.DydxChainSubaccount,
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
				name: 'blockHeight',
				label: 'block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'equity',
				label: 'equity',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'freeCollateral',
				label: 'free collateral',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'marginUsage',
				label: 'margin usage',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'openPositionCount',
				label: 'open position count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'openOrderCount',
				label: 'open order count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
