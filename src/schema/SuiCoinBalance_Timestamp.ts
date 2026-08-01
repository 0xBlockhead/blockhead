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
		label: 'account',
		entityType: EntityType.SuiAccount,
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		label: 'coin type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	totalBalance: {
		label: 'total balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinObjectCount: {
		label: 'coin object count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockedBalance: {
		label: 'locked balance',
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
