// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiCoinBalance_Timestamp,
	labels: {
		singular: 'sui coin balance timestamp',
		plural: 'sui coin balance observations',
	},
})({
	$account: {
		entityType: EntityType.SuiAccount,
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinObjectCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockedBalance: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountCoinTypeTimestampMsSource: [
			'$account',
			'coinType',
			'timestampMs',
			'source',
		],
	},
})
