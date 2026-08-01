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
		label: 'transaction',
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	changeIndex: {
		label: 'change index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	ownerSelector: {
		label: 'owner selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinType: {
		label: 'coin type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$coinType: {
		label: 'coin type',
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountDelta: {
		label: 'amount delta',
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
