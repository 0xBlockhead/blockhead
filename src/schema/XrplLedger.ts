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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerHash: {
		label: 'ledger hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	closeTimeMs: {
		label: 'close time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validated: {
		label: 'validated',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalCoinsDrops: {
		label: 'total coins drops',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHash: {
		label: 'parent hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountHash: {
		label: 'account hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerEntries: {
		label: 'ledger entries',
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
