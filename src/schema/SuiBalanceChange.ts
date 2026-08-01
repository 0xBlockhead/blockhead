// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
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
