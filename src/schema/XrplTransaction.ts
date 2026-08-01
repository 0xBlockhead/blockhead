// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplTransaction,
	labels: {
		singular: 'xrpl transaction',
		plural: 'xrpl transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.XrplTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$affectedEntries: {
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})
