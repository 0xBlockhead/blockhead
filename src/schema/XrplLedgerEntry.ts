// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplLedgerEntry,
	labels: {
		singular: 'xrpl ledger entry',
		plural: 'xrpl ledger entries',
	},
})({
	$ledger: {
		label: 'ledger',
		entityType: EntityType.XrplLedger,
		cardinality: EntityFieldCardinality.One,
	},
	entryHash: {
		label: 'entry hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryType: {
		label: 'entry type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		label: 'previous transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLedgerIndex: {
		label: 'previous transaction ledger index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fields: {
		label: 'fields',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LedgerEntryHash: [
			'$ledger',
			'entryHash',
		],
	},
})
