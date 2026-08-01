// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplLedger,
	labels: {
		singular: 'xrpl ledger',
		plural: 'xrpl ledgers',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	closeTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validated: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalCoinsDrops: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerEntries: {
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkLedgerIndex: [
			'$network',
			'ledgerIndex',
		],
		NetworkLedgerHash: [
			'$network',
			'ledgerHash',
		],
	},
})
