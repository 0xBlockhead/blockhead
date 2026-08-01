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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		label: 'transaction type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sequence: {
		label: 'sequence',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.XrplTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$affectedEntries: {
		label: 'affected entries',
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
