// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiBalanceChangeSelector {
	TransactionChangeIndex = 'TransactionChangeIndex',
}
export default {
	entityType: EntityType.SuiBalanceChange,
	label: 'sui balance change',
	labelPlural: 'sui balance changes',
	selectors: [
		{
			name: SuiBalanceChangeSelector.TransactionChangeIndex,
			fields: [
				'$transaction',
				'changeIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'changeIndex',
			label: 'change index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ownerSelector',
			label: 'owner selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinType',
			label: 'coin type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinType',
			label: 'coin type',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiCoinType,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountDelta',
			label: 'amount delta',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
