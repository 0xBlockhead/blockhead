// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	changeIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinType: {
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountDelta: {
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
