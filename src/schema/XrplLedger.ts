// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerHash: {
		label: 'ledger hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	closeTimeMs: {
		label: 'close time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validated: {
		label: 'validated',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalCoinsDrops: {
		label: 'total coins drops',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentHash: {
		label: 'parent hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountHash: {
		label: 'account hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionHash: {
		label: 'transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerEntries: {
		label: 'ledger entries',
		type: EntityFieldType.EntitiesReference,
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
