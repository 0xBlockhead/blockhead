// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiBalanceChangeSelector {
	TransactionChangeIndex = 'TransactionChangeIndex',
}
export const SuiBalanceChange = entity({
	entityType: EntityType.SuiBalanceChange,
	labels: {
		singular: 'sui balance change',
		plural: 'sui balance changes',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	changeIndex: {
		label: 'change index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerSelector: {
		label: 'owner selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinType: {
		label: 'coin type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinType: {
		label: 'coin type',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountDelta: {
		label: 'amount delta',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		TransactionChangeIndex: [
			'$transaction',
			'changeIndex',
		],
	},
})
