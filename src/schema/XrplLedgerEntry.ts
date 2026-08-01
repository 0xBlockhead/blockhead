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
		entityType: EntityType.XrplLedger,
		cardinality: EntityFieldCardinality.One,
	},
	entryHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLedgerIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fields: {
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
